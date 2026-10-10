import { test, expect } from "@playwright/test";
test("depth visualizer computes true derivatives and responds to settings", async ({
  page,
}) => {
  await page.goto("/");
  await page
    .getByRole("link", { name: /Vanishing & Exploding Gradients/ })
    .click();
  await expect(
    page.getByRole("heading", { name: /See gradients fade/ }),
  ).toBeVisible();
  await page.getByRole("button", { name: "linear", exact: true }).click();
  await page.getByRole("slider", { name: "Weight" }).fill("0.5");
  await page.getByRole("slider", { name: "Depth" }).fill("8");
  await expect(page.getByTestId("depth-gradient")).toContainText("0.0039063");
  await page.getByRole("button", { name: "Inspect layer 8" }).click();
  await expect(page.getByTestId("depth-local-step")).toContainText("Layer 8");
  await page.getByRole("slider", { name: "Weight" }).fill("1.5");
  await expect(page.getByTestId("depth-gradient")).toContainText("25.629");
  await page.getByRole("button", { name: "Reset" }).last().click();
  await expect(page.getByRole("slider", { name: "Depth" })).toHaveValue("12");
});
