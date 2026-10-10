import { openCourseSupport } from "./fixtures/courseSupport";
import { installPyodideMirror } from "./fixtures/pyodide";
import { test, expect, type Page } from "@playwright/test";
import fs from "node:fs";

const lessons = ["foundations", "neural", "training"].flatMap((name) =>
  JSON.parse(fs.readFileSync(`src/course/${name}.json`, "utf8")),
);
const first = lessons[0];

async function openCourse(page: Page) {
  await installPyodideMirror(page.context());
  await page.goto("/");
  if (
    !(await page
      .getByRole("button", { name: "Start beginner course", exact: true })
      .isVisible())
  )
    await page
      .getByRole("button", { name: "Toggle lesson navigation" })
      .click();
  await page
    .getByRole("button", { name: "Start beginner course", exact: true })
    .click();
  await openCourseSupport(page);
}
const executed = (page: Page) =>
  expect(
    page.getByRole("status").filter({ hasText: "Executed Python. Inspect" }),
  ).toBeVisible({ timeout: 95_000 });
async function toLastOperation(page: Page) {
  for (
    let n = 0;
    n < 25 && !(await page.getByTestId("course-result").count());
    n++
  )
    await page
      .getByRole("button", { name: "Next operation", exact: true })
      .click();
}

test("hints 1 and 2 need no runtime, hint 3 reveals exactly one real operation, hint 4 reveals the rest", async ({
  page,
}) => {
  test.setTimeout(240_000);
  await openCourse(page);
  const workspace = page.getByRole("article", { name: "Beginner lesson" });
  await expect(page.getByTestId("hint-note")).toContainText("No hints used");

  // Levels 1 and 2 are authored from lesson data: no Python, no trace, no result.
  await page.getByRole("button", { name: /Show hint 1/ }).click();
  await expect(
    workspace.getByText("Point me at the right quantity"),
  ).toBeVisible();
  await expect(page.getByTestId("course-result")).toHaveCount(0);
  await page.getByRole("button", { name: /Show hint 2/ }).click();
  await expect(workspace.getByText("Remind me of the rule")).toBeVisible();
  await expect(page.getByTestId("hint-note")).toContainText(
    "assisted success, not independent",
  );
  await expect(
    page.getByRole("table", { name: "Exact inspected values" }),
  ).toHaveCount(0);

  // Level 3 executes the authored Python program and shows one operation only.
  await page.getByRole("button", { name: /Show hint 3/ }).click();
  await expect(
    page.getByRole("table", { name: "Exact inspected values" }),
  ).toBeVisible({ timeout: 95_000 });
  await expect(
    page
      .getByRole("table", { name: "Exact inspected values" })
      .locator("tbody tr"),
  ).toHaveCount(1);
  await expect(page.getByTestId("course-result")).toHaveCount(0);
  // The prediction must stay open after a partial hint.
  await expect(
    page.getByRole("spinbutton", { name: "Your prediction", exact: true }),
  ).toBeEnabled();

  // Level 4 reveals everything and locks the prediction.
  await page
    .getByRole("spinbutton", { name: "Your prediction", exact: true })
    .fill(String(first.cases[0].expected));
  await page.getByRole("button", { name: /Show hint 4/ }).click();
  await expect(page.getByTestId("course-result")).toBeVisible({
    timeout: 95_000,
  });
  await expect(
    page.getByRole("spinbutton", { name: "Your prediction", exact: true }),
  ).toBeDisabled();
  await expect(
    page.getByRole("button", { name: "All hints shown" }),
  ).toBeDisabled();
});

test("a hinted pass records assisted success; an unaided pass records independent success", async ({
  page,
}) => {
  test.setTimeout(300_000);
  await openCourse(page);
  const evidence = page.getByTestId("evidence-summary");
  await expect(evidence).toContainText("0 passed unaided");

  // Worked case with a hint -> assisted only.
  await page.getByRole("button", { name: /Show hint 1/ }).click();
  await page
    .getByRole("spinbutton", { name: "Your prediction", exact: true })
    .fill(String(first.cases[0].expected));
  await page
    .getByRole("button", { name: "Reveal calculation", exact: true })
    .click();
  await executed(page);
  await toLastOperation(page);
  await page
    .getByRole("button", { name: first.choices[first.correct], exact: true })
    .click();
  await page
    .getByRole("button", { name: "Check practice", exact: true })
    .click();
  await expect(
    page
      .getByRole("status")
      .filter({ hasText: "Recorded as assisted success" }),
  ).toBeVisible();

  // Transfer case unaided -> still assisted overall, because one case used a hint.
  await page
    .getByRole("button", { name: "Transfer case", exact: true })
    .click();
  await page
    .getByRole("spinbutton", { name: "Your prediction", exact: true })
    .fill(String(first.cases[1].expected));
  await page
    .getByRole("button", { name: "Reveal calculation", exact: true })
    .click();
  await executed(page);
  await toLastOperation(page);
  await page
    .getByRole("button", { name: first.choices[first.correct], exact: true })
    .click();
  await page
    .getByRole("button", { name: "Check practice", exact: true })
    .click();
  await expect(
    page
      .getByRole("status")
      .filter({ hasText: "Recorded as independent success" }),
  ).toBeVisible();
  await expect(evidence).toContainText("1 / 60 practice criteria met");
  await expect(evidence).toContainText("0 passed unaided");
  await expect(evidence).toContainText("1 passed with help");
  await expect(
    page
      .getByRole("navigation", { name: "Beginner topics" })
      .getByRole("link", { name: first.title, exact: true }),
  ).toContainText("Passed with help");

  // A second lesson solved with no hints at all earns independence.
  const second = lessons[1];
  await page
    .getByRole("navigation", { name: "Beginner topics" })
    .getByRole("link", { name: second.title, exact: true })
    .click();
  for (const i of [0, 1]) {
    await page
      .getByRole("button", {
        name: i ? "Transfer case" : "Worked case",
        exact: true,
      })
      .click();
    await page
      .getByRole("spinbutton", { name: "Your prediction", exact: true })
      .fill(String(second.cases[i].expected));
    await page
      .getByRole("button", { name: "Reveal calculation", exact: true })
      .click();
    await executed(page);
    await toLastOperation(page);
    await page
      .getByRole("button", {
        name: second.choices[second.correct],
        exact: true,
      })
      .click();
    await page
      .getByRole("button", { name: "Check practice", exact: true })
      .click();
  }
  await expect(evidence).toContainText("1 passed unaided");
  await expect(
    page
      .getByRole("navigation", { name: "Beginner topics" })
      .getByRole("link", { name: second.title, exact: true }),
  ).toContainText("Passed unaided");

  // Evidence survives a reload with the two states still distinguished.
  await page.reload({ waitUntil: "domcontentloaded", timeout: 30_000 });
  await page
    .getByRole("button", { name: "Start beginner course", exact: true })
    .click();
  await openCourseSupport(page);
  await expect(page.getByTestId("evidence-summary")).toContainText(
    "1 passed unaided",
  );
  await expect(page.getByTestId("evidence-summary")).toContainText(
    "1 passed with help",
  );
});

test("a wrong prediction is diagnosed against the executed trace, not just marked wrong", async ({
  page,
}) => {
  test.setTimeout(240_000);
  await openCourse(page);
  // dl-00-001 computes x * factor + offset = 2 * 3 + 1. Stopping before the
  // offset is the single most common slip, and must be named as such.
  await page
    .getByRole("spinbutton", { name: "Your prediction", exact: true })
    .fill("6");
  await page
    .getByRole("button", { name: "Reveal calculation", exact: true })
    .click();
  await executed(page);
  await page
    .getByRole("button", { name: "Reveal all operations", exact: true })
    .click();
  await expect(page.getByTestId("course-result")).toContainText(
    "Prediction differs",
  );
  const diagnostic = page.getByTestId("diagnostic");
  await expect(diagnostic).toContainText("Multiply by factor");
  await expect(diagnostic).toContainText("One later operation was not applied");
  await expect(
    page.getByText("restate the rule in your own words"),
  ).toBeVisible();

  // A reversed sign is reported as a sign error, not as an unrelated answer.
  await page
    .getByRole("button", { name: "Transfer case", exact: true })
    .click();
  await page
    .getByRole("spinbutton", { name: "Your prediction", exact: true })
    .fill(String(-first.cases[1].expected));
  await page
    .getByRole("button", { name: "Reveal calculation", exact: true })
    .click();
  await executed(page);
  await page
    .getByRole("button", { name: "Reveal all operations", exact: true })
    .click();
  await expect(page.getByTestId("diagnostic")).toContainText(
    "sign is reversed",
  );
});

test("operation playback is keyboard operable, speed adjustable and honours reduced motion", async ({
  page,
}) => {
  test.setTimeout(240_000);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await openCourse(page);
  await page
    .getByRole("spinbutton", { name: "Your prediction", exact: true })
    .fill(String(first.cases[0].expected));
  await page
    .getByRole("button", { name: "Reveal calculation", exact: true })
    .click();
  await executed(page);
  const player = page.getByRole("group", { name: "Operation playback" });
  await expect(player).toBeVisible();
  // Reduced motion disables automatic advance up front, not only when the
  // preference changes mid-session, and says so instead of silently ignoring clicks.
  await expect(
    player.getByRole("button", { name: "Automatic playback off" }),
  ).toBeDisabled();
  await expect(player.getByLabel("Playback speed")).toBeDisabled();
  await expect(player).toContainText("no information is withheld");

  // Keyboard-only stepping reaches the result without touching the mouse.
  for (
    let n = 0;
    n < 25 && !(await page.getByTestId("course-result").count());
    n++
  ) {
    await page
      .getByRole("button", { name: "Next operation", exact: true })
      .focus();
    await page.keyboard.press("Enter");
  }
  await expect(page.getByTestId("course-result")).toBeVisible();

  // Nothing advances on its own: after rewinding, the step stays put.
  await page
    .getByRole("button", { name: "Replay stages", exact: true })
    .click();
  await expect(player).toContainText(`Stage 1 / `);
  await page.waitForTimeout(2500);
  await expect(player).toContainText(`Stage 1 / `);

  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});
