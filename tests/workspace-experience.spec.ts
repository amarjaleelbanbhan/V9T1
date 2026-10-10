import { test, expect } from "@playwright/test";

test("workspace URLs take priority over resume and browser history returns to the previous lab", async ({
  page,
}) => {
  await page.goto("/#/lab/tensor");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "See the shape of data",
  );
  await page.getByRole("link", { name: /Activation Functions/ }).click();
  await expect(page).toHaveURL(/#\/lab\/activation$/);
  await page.goBack();
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "See the shape of data",
  );
  await page.goForward();
  await expect(page).toHaveURL(/#\/lab\/activation$/);
  await page.reload();
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Shape the signal",
  );
  await page.goto("/#/lab/neuron");
  await expect(
    page.getByRole("heading", { name: /Inside a Neuron/ }),
  ).toBeVisible();
});

test("mobile navigation traps focus, closes with Escape, and returns focus to its trigger", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const toggle = page.getByRole("button", { name: "Toggle lesson navigation" });
  await toggle.click();
  const drawer = page.getByRole("dialog", { name: "Learning navigation" });
  await expect(drawer).toBeVisible();
  await expect(
    drawer.getByRole("button", { name: "Close navigation", exact: true }),
  ).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(drawer.locator("summary")).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(
    drawer.getByRole("button", { name: "Close navigation", exact: true }),
  ).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(toggle).toBeFocused();
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await toggle.click();
  await drawer.getByRole("link", { name: /Tensors & Slicing/ }).click();
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "See the shape of data",
  );
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});

test("bias mission uses the real model, rejects an altered setup and restores the prior experiment", async ({
  page,
}) => {
  await page.goto("/#/lab/neuron");
  const mission = page.getByRole("region", {
    name: "Wake a silent neuron mission",
  });
  await mission.getByRole("button", { name: "Load the challenge" }).click();
  await expect(page.getByTestId("output")).toHaveText("0");
  await mission.getByRole("spinbutton", { name: "Predicted bias" }).fill("-2");
  await mission.getByRole("button", { name: "Test this bias" }).click();
  await expect(mission.getByRole("status")).toContainText("Keep investigating");
  await expect(page.getByTestId("output")).toHaveText("0");
  await mission.getByRole("spinbutton", { name: "Predicted bias" }).fill("0.5");
  await mission.getByRole("button", { name: "Test this bias" }).click();
  await expect(mission.getByRole("status")).toContainText("Target reached");
  await expect(page.getByTestId("output")).toHaveText("1.5");
  const input = page.getByRole("slider", { name: /Input x1/ });
  await input.focus();
  await input.press("ArrowRight");
  await expect(
    mission.getByRole("button", { name: "Test this bias" }),
  ).toBeDisabled();
  await mission.getByRole("button", { name: "Restore my experiment" }).click();
  await expect(page.getByTestId("output")).toHaveText("0.957");
  expect(
    await page.evaluate(() => localStorage.getItem("neurallab.beginner.v1")),
  ).toBeNull();
});

test("node inspection follows calculation stages and the map opens a real authored lesson", async ({
  page,
}) => {
  await page.goto("/#/lab/neuron");
  await page.getByRole("button", { name: "2D", exact: true }).click();
  await page
    .getByRole("button", { name: "Inspect input 1", exact: true })
    .click();
  await expect(page.locator(".node-inspector")).toContainText(
    "Step to Multiply weights",
  );
  await page.getByRole("button", { name: "Go to Multiply weights" }).click();
  await expect(page.locator(".node-inspector")).toContainText("2 × 0.8 = 1.6");
  await page.getByRole("button", { name: "My learning" }).click();
  const map = page.getByRole("region", { name: "Chapter learning map" });
  await expect(map).toContainText("0 unaided · 0 with help");
  await map
    .getByRole("button", { name: "Open Computers and programs", exact: true })
    .click();
  await expect(
    page.getByRole("article", { name: "Beginner lesson" }),
  ).toContainText("Computers and programs");
});

test("forward SVG exposes keyboard connections and scrollable Python source receives focus", async ({
  page,
}) => {
  await page.goto("/#/lab/propagation");
  const graph = page.getByRole("group", {
    name: /Interactive forward propagation/,
  });
  const connection = graph.getByRole("button", {
    name: "Connection Input 2 to Hidden 1",
    exact: true,
  });
  await connection.focus();
  await connection.press("Enter");
  await expect(page.getByTestId("selected-edge")).toHaveText(
    "Input 2 → Hidden 1",
  );
  await page.getByRole("tab", { name: "Code", exact: true }).click();
  await page
    .getByText("Inspect current Python example", { exact: true })
    .click();
  const source = page.getByRole("region", {
    name: "Python source",
    exact: true,
  });
  await source.focus();
  await expect(source).toBeFocused();
  await expect(source).toContainText("for layer in layers:");
});
