import { test, expect } from "@playwright/test";
import { installPyodideMirror } from "./fixtures/pyodide";
test("neuron Python executes current parameters and clears stale output on changes", async ({
  page,
}) => {
  test.setTimeout(140000);
  await installPyodideMirror(page.context());
  await page.goto("/");
  await page.getByRole("tab", { name: "Code", exact: true }).click();
  const panel = page.getByRole("region", { name: "Executable Python" });
  await expect(panel.locator("code")).toContainText("sum(value * weight");
  await panel.getByRole("button", { name: "Run Python example" }).click();
  await expect(panel.getByTestId("python-program-output")).toContainText(
    "a =",
    { timeout: 95000 },
  );
  await page.getByRole("slider", { name: /Weight w1/ }).focus();
  await page.keyboard.press("ArrowRight");
  await expect(panel.getByTestId("python-program-output")).toHaveCount(0);
  await panel.getByRole("button", { name: "Run Python example" }).click();
  await expect(panel.getByTestId("python-program-output")).toContainText(
    "a =",
    { timeout: 95000 },
  );
});
test("forward inspector executes valid Python instead of pseudocode", async ({
  page,
}) => {
  test.setTimeout(140000);
  await installPyodideMirror(page.context());
  await page.goto("/");
  await page.getByRole("link", { name: /Forward Propagation/ }).click();
  await page.getByRole("tab", { name: "Code", exact: true }).click();
  const panel = page.getByRole("region", { name: "Executable Python" });
  await expect(panel.locator("code")).toContainText("for layer in layers:");
  await panel.getByRole("button", { name: "Run Python example" }).click();
  await expect(panel.getByTestId("python-program-output")).toBeVisible({
    timeout: 95000,
  });
});
test("all other visual labs expose working Python matching current controls", async ({
  page,
}) => {
  test.setTimeout(240000);
  await installPyodideMirror(page.context());
  await page.goto("/");
  for (const lesson of [
    "Deep Learning Foundations",
    "Activation Functions",
    "Tensors & Slicing",
    "Perceptron & Logic Gates",
    "Loss & Gradient Descent",
    "Backpropagation & Chain Rule",
    "Vanishing & Exploding Gradients",
  ]) {
    const nav = page.getByRole("navigation", { name: "Course lessons" });
    const button = nav.getByRole("link").filter({ hasText: lesson });
    if (!(await button.count())) throw Error("Missing navigation: " + lesson);
    await button.click();
    const panel = page.getByRole("region", { name: "Executable Python" });
    await panel.getByRole("button", { name: "Run Python example" }).click();
    await expect(panel.getByTestId("python-program-output")).toBeVisible({
      timeout: 95000,
    });
  }
});
test("cancel and changed input cannot restore stale output; failed downloads remain retryable", async ({
  page,
}) => {
  await page.route(
    "https://cdn.jsdelivr.net/pyodide/v0.27.7/full/**",
    (route) => route.abort(),
  );
  await page.goto("/");
  await page.getByRole("tab", { name: "Code", exact: true }).click();
  const panel = page.getByRole("region", { name: "Executable Python" });
  await panel.getByRole("button", { name: "Run Python example" }).click();
  await expect(panel.getByRole("status")).not.toContainText("Loading", {
    timeout: 10000,
  });
  await expect(panel.getByTestId("python-program-output")).toHaveCount(0);
  await expect(
    panel.getByRole("button", { name: "Run Python example" }),
  ).toBeEnabled();
  await page.unroute("https://cdn.jsdelivr.net/pyodide/v0.27.7/full/**");
  await page.route(
    "https://cdn.jsdelivr.net/pyodide/v0.27.7/full/**",
    async (route) => {
      await new Promise((done) => setTimeout(done, 500));
      await route.abort();
    },
  );
  await panel.getByRole("button", { name: "Run Python example" }).click();
  await panel.getByRole("button", { name: "Cancel Python example" }).click();
  await expect(panel.getByRole("status")).toContainText("Canceled");
  await expect(panel.getByTestId("python-program-output")).toHaveCount(0);
});
