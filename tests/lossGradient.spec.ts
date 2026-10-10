import { test, expect } from "@playwright/test";
test("loss and gradient descent calculations follow the visual timeline", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  await page.getByRole("link", { name: /Loss & Gradient Descent/ }).click();
  await expect(
    page.getByRole("heading", { name: /Follow the loss downhill/ }),
  ).toBeVisible();
  await expect(page.getByTestId("loss-step")).toHaveText("0 / 6");
  await expect(page.getByTestId("loss-value")).toHaveText("0.5");
  await expect(page.getByTestId("loss-weight")).toHaveText("2");
  await expect(page.getByTestId("loss-gradient")).toContainText("= 1");
  await expect(page.getByTestId("loss-next")).toContainText("= 1.8");
  await page.getByRole("button", { name: "Next update" }).click();
  await expect(page.getByTestId("loss-step")).toHaveText("1 / 6");
  await expect(page.getByTestId("loss-weight")).toHaveText("1.8");
  await expect(page.getByTestId("loss-value")).toHaveText("0.32");
  await page
    .getByRole("group", { name: "Choose loss function" })
    .getByRole("button", { name: "L(w) = w²" })
    .click();
  await expect(page.getByTestId("loss-value")).toHaveText("4");
  await expect(page.getByTestId("loss-gradient")).toContainText("= 4");
  await page.getByRole("button", { name: "Next update" }).click();
  await expect(page.getByTestId("loss-weight")).toHaveText("1.2");
  await expect(page.getByTestId("loss-value")).toHaveText("1.44");
  await page.getByRole("button", { name: "Weight decreases" }).click();
  await expect(
    page.getByRole("status").filter({ hasText: "Correct" }),
  ).toContainText("Correct");
  await page.getByRole("button", { name: "Reset loss experiment" }).click();
  await expect(page.getByTestId("loss-value")).toHaveText("0.5");
  expect(errors).toEqual([]);
});
test("learning rate 1 oscillates for w squared, while zero rate does not update", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("link", { name: /Loss & Gradient Descent/ }).click();
  await page
    .getByRole("group", { name: "Choose loss function" })
    .getByRole("button", { name: "L(w) = w²" })
    .click();
  const rate = page.getByRole("slider", { name: /Learning rate/ });
  await rate.focus();
  await rate.press("End");
  await page.getByRole("button", { name: "Next update" }).click();
  await expect(page.getByTestId("loss-weight")).toHaveText("-2");
  await expect(page.getByTestId("loss-value")).toHaveText("4");
  await rate.focus();
  await rate.press("Home");
  await page.getByRole("button", { name: "Next update" }).click();
  await expect(page.getByTestId("loss-weight")).toHaveText("2");
  await page.getByRole("button", { name: "Weight unchanged" }).click();
  await expect(
    page.getByRole("status").filter({ hasText: "Correct" }),
  ).toContainText("Correct");
});
test("loss lab works on narrow mobile viewport", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("button", { name: "Toggle lesson navigation" }).click();
  await page.getByRole("link", { name: /Loss & Gradient Descent/ }).click();
  await expect(
    page.getByRole("heading", { name: /Follow the loss downhill/ }),
  ).toBeVisible();
  await expect(
    page.getByRole("slider", { name: /Learning rate/ }),
  ).toBeVisible();
  const overflow = await page.evaluate(
    () =>
      document.documentElement.scrollWidth -
      document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(1);
});
