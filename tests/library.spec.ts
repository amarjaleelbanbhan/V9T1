import { test, expect } from "@playwright/test";
import { installPyodideMirror } from "./fixtures/pyodide";
test("searches curriculum, loads a source-backed chapter, preserves labs and removes footer", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Browse full curriculum" }).click();
  await page.getByRole("searchbox").fill("dtype");
  await expect(page.getByRole("status")).toHaveText("1 chapters match");
  await page
    .getByRole("link", { name: "Read Tensors and computation specification" })
    .click();
  await expect(
    page.getByRole("article", { name: "Chapter specification" }),
  ).toContainText("24 payload bytes");
  await expect(
    page.getByRole("link", { name: "NumPy beginner guide" }),
  ).toBeVisible();
  await expect(page.locator("footer")).toHaveCount(0);
  await page.getByRole("link", { name: /The Artificial Neuron/ }).click();
  await expect(page.getByTestId("output")).toBeVisible();
});
test("curriculum and Python controls fit mobile and reduced motion", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.getByRole("button", { name: "Toggle lesson navigation" }).click();
  await page.getByRole("button", { name: "Python execution lab" }).click();
  await expect(page.getByRole("button", { name: "Run Python" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Next line" })).toBeDisabled();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});
test("fixed Python runs NumPy and exposes real traced values", async ({
  page,
}) => {
  test.setTimeout(110_000);
  await installPyodideMirror(page.context());
  await page.goto("/");
  await page.getByRole("button", { name: "Python execution lab" }).click();
  await page.getByRole("spinbutton", { name: "x[0, 0]" }).fill("9");
  await page.getByRole("button", { name: "Run Python" }).click();
  await expect(page.getByRole("status")).toContainText("Executed Python.", {
    timeout: 95_000,
  });
  for (let i = 0; i < 5; i++)
    await page.getByRole("button", { name: "Next line" }).click();
  await expect(
    page.getByText("Measured payload: 24 bytes", { exact: true }),
  ).toBeVisible();
  await expect(page.getByText("dtype: float32", { exact: true })).toBeVisible();
  await expect(page.locator(".python-cell").first()).toHaveText("9");
});
test("chapter Markdown renders semantic headings and navigates lesson files internally", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Browse full curriculum" }).click();
  await page.getByRole("searchbox").fill("dtype");
  await page
    .getByRole("link", { name: "Read Tensors and computation specification" })
    .click();
  const detail = page.getByRole("article", { name: "Chapter specification" });
  const libraryURL = page.url();
  await expect(
    detail.getByRole("heading", { name: "Learning sequence", exact: true }),
  ).toBeVisible();
  await expect(detail.locator("ul").first().locator("li")).toHaveCount(7);
  await detail
    .getByRole("link", { name: "Shape, rank and dtype", exact: true })
    .click();
  await expect(
    detail.getByRole("heading", { name: "Shape, rank and dtype", exact: true }),
  ).toBeVisible();
  await expect(
    detail.getByRole("button", { name: "Back to chapter" }),
  ).toBeVisible();
  await expect(page).not.toHaveURL(libraryURL);
  await detail.getByRole("button", { name: "Back to chapter" }).click();
  await expect(
    detail.getByRole("heading", { name: "Learning sequence", exact: true }),
  ).toBeVisible();
  await page.setViewportSize({ width: 390, height: 844 });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});
