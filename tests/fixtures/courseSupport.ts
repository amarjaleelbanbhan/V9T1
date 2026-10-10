import type { Page } from "@playwright/test";
/** Tests of optional support explicitly open its disclosures; task-first layout is tested separately. */
export async function openCourseSupport(page: Page) {
  await page
    .getByRole("heading", { level: 1, name: /Learn, calculate, explain/ })
    .waitFor();
  for (const selector of [
    ".topic-navigation",
    'details:has(> summary:text-is("Saved course evidence and review settings"))',
  ]) {
    const details = page.locator(selector);
    if (!(await details.evaluate((el) => el.hasAttribute("open"))))
      await details.locator("summary").first().click();
  }
}
