import { test, expect } from "@playwright/test";
test("Week 4 scalar activation and Softmax are synchronized", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  await page.getByRole("link", { name: /Activation Functions/ }).click();
  await expect(
    page.getByRole("heading", { name: /Shape the signal/ }),
  ).toBeVisible();
  await expect(page.getByTestId("activation-output")).toHaveText("0");
  await page
    .getByRole("group", { name: "Choose activation function" })
    .getByRole("button", { name: "Leaky ReLU" })
    .click();
  await expect(page.getByTestId("activation-output")).toHaveText("-0.2");
  await expect(page.getByTestId("activation-gradient")).toHaveText("0.1");
  await page.getByRole("button", { name: "Sigmoid" }).click();
  await expect(page.getByTestId("activation-output")).toHaveText("0.119");
  await page.getByRole("button", { name: "Softmax" }).click();
  await expect(page.getByTestId("softmax-sum")).toHaveText("1.000");
  await expect(
    page.getByRole("img", { name: /Three Softmax probabilities/ }),
  ).toBeVisible();
  const slider = page.getByRole("slider", { name: /Logit 1/ });
  await slider.focus();
  await slider.press("End");
  await expect(page.getByTestId("softmax-sum")).toHaveText("1.000");
  await page
    .getByRole("button", { name: "Leaky ReLU", exact: true })
    .last()
    .click();
  await expect(
    page.getByRole("status").filter({ hasText: "Correct" }),
  ).toContainText("Correct");
  await page.getByRole("link", { name: /The Artificial Neuron/ }).click();
  await expect(
    page.getByRole("heading", { name: /Inside a Neuron/ }),
  ).toBeVisible();
  expect(errors).toEqual([]);
});
test("Week 4 fits narrow mobile layout", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("button", { name: "Toggle lesson navigation" }).click();
  await page.getByRole("link", { name: /Activation Functions/ }).click();
  await expect(
    page.getByRole("heading", { name: /Shape the signal/ }),
  ).toBeVisible();
  await expect(page.getByRole("slider", { name: /Input z/ })).toBeVisible();
  const overflow = await page.evaluate(
    () =>
      document.documentElement.scrollWidth -
      document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(1);
});
