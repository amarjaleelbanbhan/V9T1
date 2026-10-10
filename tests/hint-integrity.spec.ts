import { openCourseSupport } from "./fixtures/courseSupport";
import { test, expect, type Page } from "@playwright/test";
import { installPyodideMirror } from "./fixtures/pyodide";
import { emptyLearning, scheduleRecall, Rating } from "../src/course/learning";
async function openCourse(page: Page) {
  await installPyodideMirror(page.context());
  await page.goto("/");
  await page
    .getByRole("button", { name: "Start beginner course", exact: true })
    .click();
  await openCourseSupport(page);
}
test("partial hints keep completed grids and curves hidden until the full reveal", async ({
  page,
}) => {
  test.setTimeout(240_000);
  await openCourse(page);
  for (const title of ["Matrix multiplication", "Algebra and graphs"]) {
    await page
      .getByRole("navigation", { name: "Beginner topics" })
      .getByRole("link", { name: title, exact: true })
      .click();
    for (const level of [1, 2, 3])
      await page
        .getByRole("button", { name: new RegExp(`Show hint ${level}:`) })
        .click();
    await expect(
      page.getByRole("table", { name: "Exact inspected values" }),
    ).toBeVisible({ timeout: 95_000 });
    await expect(
      page
        .getByRole("table", { name: "Exact inspected values" })
        .locator("tbody tr"),
    ).toHaveCount(1);
    await expect(
      page.getByRole("table", { name: "Computation grid" }),
    ).toHaveCount(0);
    await expect(
      page.getByRole("img", { name: "Function graph with labeled endpoints" }),
    ).toHaveCount(0);
    await expect(
      page.getByRole("button", { name: /Show hint 4:/ }),
    ).toBeDisabled();
    await page
      .getByRole("spinbutton", { name: "Your prediction", exact: true })
      .fill("1");
    await page.getByRole("button", { name: /Show hint 4:/ }).click();
    if (title === "Matrix multiplication")
      await expect(
        page.getByRole("table", { name: "Computation grid" }),
      ).toBeVisible();
    else
      await expect(
        page.getByRole("img", {
          name: "Function graph with labeled endpoints",
        }),
      ).toBeVisible();
  }
});
test("a worked solution cannot treat an empty prediction as the correct answer zero", async ({
  page,
}) => {
  test.setTimeout(180_000);
  await openCourse(page);
  await page
    .getByRole("navigation", { name: "Beginner topics" })
    .getByRole("link", { name: "Device placement", exact: true })
    .click();
  for (const level of [1, 2, 3])
    await page
      .getByRole("button", { name: new RegExp(`Show hint ${level}:`) })
      .click();
  await expect(
    page.getByRole("table", { name: "Exact inspected values" }),
  ).toBeVisible({ timeout: 95_000 });
  await expect(
    page.getByRole("button", { name: /Show hint 4:/ }),
  ).toBeDisabled();
  await expect(page.getByTestId("course-result")).toHaveCount(0);
  await page
    .getByRole("spinbutton", { name: "Your prediction", exact: true })
    .fill("0");
  await page.getByRole("button", { name: /Show hint 4:/ }).click();
  await expect(page.getByTestId("course-result")).toContainText(
    "Prediction matched",
  );
  await expect(page.getByTestId("hint-note")).toContainText(
    "not independent success",
  );
});
test("failed scheduled recall keeps the topic unaided without claiming successful later recall", async ({
  page,
}) => {
  const id = "dl-00-001:concept";
  let learning = scheduleRecall(emptyLearning(), id, Rating.Good, 1000);
  learning = scheduleRecall(
    learning,
    id,
    Rating.Again,
    learning.cards[id].due.getTime() + 1,
  );
  await page.addInitScript(
    ({ progress, learning }) => {
      localStorage.setItem("neurallab.beginner.v1", JSON.stringify(progress));
      localStorage.setItem("neurallab.learning.v1", learning);
    },
    {
      progress: {
        "dl-00-001": {
          attempts: 2,
          cases: [0, 1],
          independentCases: [0, 1],
          passedAt: 500,
          independentAt: 500,
        },
      },
      learning: JSON.stringify(learning),
    },
  );
  await openCourse(page);
  await expect(page.getByTestId("evidence-summary")).toContainText(
    "1 passed unaided",
  );
  await expect(page.getByTestId("evidence-summary")).toContainText(
    "0 recalled later",
  );
});
