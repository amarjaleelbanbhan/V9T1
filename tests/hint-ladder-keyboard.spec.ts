import { test, expect, type Page, type Locator } from "@playwright/test";
import { installPyodideMirror } from "./fixtures/pyodide";

async function tabTo(
  page: Page,
  target: Locator,
  limit: number,
  reverse = false,
) {
  for (let n = 0; n <= limit; n++) {
    if (await target.evaluate((el) => el === document.activeElement)) return n;
    await page.keyboard.press(reverse ? "Shift+Tab" : "Tab");
  }
  throw Error(`Control not reached within ${limit} tabs`);
}
async function openCourse(page: Page) {
  await installPyodideMirror(page.context());
  await page.goto("/");
}
const executed = (page: Page) =>
  expect(
    page.getByRole("status").filter({ hasText: "Executed Python. Inspect" }),
  ).toBeVisible({ timeout: 95_000 });

test("keyboard reaches the hints and completes a prediction without mouse or programmatic focus", async ({
  page,
}) => {
  test.setTimeout(120_000);
  await openCourse(page);
  const start = page.getByRole("button", {
    name: "Start beginner course",
    exact: true,
  });
  await tabTo(page, start, 40);
  await page.keyboard.press("Enter");
  const hint = page.locator(".hint-request");
  const tabs = await tabTo(page, hint, 180);
  expect(tabs).toBeLessThanOrEqual(180);
  const outline = await hint.evaluate(
    (el) => getComputedStyle(el).outlineWidth,
  );
  expect(parseFloat(outline)).toBeGreaterThan(0);
  for (let level = 1; level <= 3; level++) {
    await page.keyboard.press("Enter");
    await expect(page.locator(".hint-step")).toHaveCount(level, {
      timeout: level === 3 ? 95_000 : 5000,
    });
    if (level === 3)
      await expect(
        page.getByRole("table", { name: "Exact inspected values" }),
      ).toBeVisible({ timeout: 95_000 });
  }
  const prediction = page.getByRole("spinbutton", {
    name: "Your prediction",
    exact: true,
  });
  await tabTo(page, prediction, 30, true);
  await page.keyboard.type("7");
  const reveal = page.getByRole("button", {
    name: "Reveal calculation",
    exact: true,
  });
  await tabTo(page, reveal, 30);
  await page.keyboard.press("Enter");
  await executed(page);
  const next = page.getByRole("button", {
    name: "Next operation",
    exact: true,
  });
  await tabTo(page, next, 10);
  for (
    let n = 0;
    n < 20 && !(await page.getByTestId("course-result").count());
    n++
  )
    await page.keyboard.press("Enter");
  await expect(page.getByTestId("course-result")).toContainText(
    "Prediction matched",
  );
  const choice = page.getByRole("button", {
    name: "Multiplication, followed by offset addition",
    exact: true,
  });
  await tabTo(page, choice, 15);
  await page.keyboard.press("Enter");
  await tabTo(
    page,
    page.getByRole("button", { name: "Check practice", exact: true }),
    5,
  );
  await page.keyboard.press("Enter");
  await expect(
    page.getByRole("status").filter({ hasText: "Practice passed." }),
  ).toBeVisible();
});

test.describe("touch access", () => {
  test.use({ hasTouch: true, viewport: { width: 390, height: 844 } });
  test("390px hint text wraps and playback speed responds to touch", async ({
    page,
  }) => {
    test.setTimeout(120_000);
    await openCourse(page);
    await page.getByRole("button", { name: "Toggle lesson navigation" }).tap();
    await page
      .getByRole("button", { name: "Start beginner course", exact: true })
      .tap();
    const fits = async () =>
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
    await fits();
    for (let level = 1; level <= 3; level++) {
      await page.locator(".hint-request").tap();
      await expect(page.locator(".hint-step")).toHaveCount(level, {
        timeout: level === 3 ? 95_000 : 5000,
      });
      if (level === 3)
        await expect(
          page.getByRole("table", { name: "Exact inspected values" }),
        ).toBeVisible({ timeout: 95_000 });
      await fits();
      for (const body of await page.locator(".hint-body").all())
        expect(
          await body.evaluate((el) => el.scrollWidth <= el.clientWidth),
        ).toBe(true);
    }
    await page
      .getByRole("spinbutton", { name: "Your prediction", exact: true })
      .fill("7");
    await page
      .getByRole("button", { name: "Reveal calculation", exact: true })
      .tap();
    await executed(page);
    await fits();
    const speed = page
      .getByRole("group", { name: "Operation playback" })
      .getByLabel("Playback speed");
    expect((await speed.boundingBox())!.height).toBeGreaterThanOrEqual(44);
    await speed.tap();
    await speed.selectOption("2");
    await expect(speed).toHaveValue("2");
  });
});
