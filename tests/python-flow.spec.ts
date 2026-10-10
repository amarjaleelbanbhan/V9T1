import { test, expect } from "@playwright/test";
import { installPyodideMirror } from "./fixtures/pyodide";
test("actual Python executes conditions, call-local values and retained object state", async ({
  page,
}) => {
  test.setTimeout(240_000);
  await installPyodideMirror(page.context());
  await page.goto("/");
  await page
    .getByRole("link", { name: /Python Loops, Functions & Objects/ })
    .click();
  for (const [title, total, transfer] of [
    ["Loops and conditions", 5, 3],
    ["Functions and local names", 8, 0],
    ["Objects, state and methods", 4, 0],
  ] as const) {
    await page.getByRole("button", { name: title, exact: true }).click();
    for (const [i, v] of ["2", "-1", "3"].entries())
      await page
        .getByRole("spinbutton", { name: `List item ${i + 1}` })
        .fill(v);
    await page
      .getByRole("spinbutton", { name: "Predict final total" })
      .fill(String(total));
    await page.getByRole("button", { name: "Execute my prediction" }).click();
    await expect(
      page.getByRole("status").filter({ hasText: "Executed Python." }),
    ).toBeVisible({ timeout: 95_000 });
    if (title === "Functions and local names") {
      for (
        let i = 0;
        i < 15 &&
        !(await page
          .getByRole("heading", { name: "Scope: double", exact: true })
          .count());
        i++
      )
        await page.getByRole("button", { name: "Next event" }).click();
      await expect(
        page.getByRole("heading", { name: "Scope: double", exact: true }),
      ).toBeVisible();
      await expect(page.getByTestId("flow-locals")).toContainText('"value": 2');
    }
    await page.getByRole("button", { name: "Inspect completed trace" }).click();
    await expect(page.getByTestId("flow-globals")).toContainText(
      `"total": ${total}`,
    );
    const right = title.startsWith("Loops")
      ? "The condition value > 0 is false"
      : title.startsWith("Functions")
        ? "Inside one call to double"
        : "The total attribute of this counter instance";
    await page.getByRole("button", { name: right, exact: true }).click();
    for (const [i, v] of ["1", "-3", "2"].entries())
      await page
        .getByRole("spinbutton", { name: `List item ${i + 1}` })
        .fill(v);
    await page
      .getByRole("spinbutton", { name: "Predict final total" })
      .fill(String(transfer));
    await page.getByRole("button", { name: "Execute my prediction" }).click();
    await expect(
      page.getByRole("status").filter({ hasText: "Executed Python." }),
    ).toBeVisible({ timeout: 95_000 });
    await page.getByRole("button", { name: "Inspect completed trace" }).click();
    await page.getByRole("button", { name: right, exact: true }).click();
  }
  await expect(
    page.getByRole("region", { name: "Flow practice evidence" }),
  ).toContainText("Objects, state and methods: practice criteria met");
});
