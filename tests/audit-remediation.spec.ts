import { test, expect } from "@playwright/test";

test("failed lazy download keeps shell, navigation, and can retry", async ({
  page,
}) => {
  await page.route("**/lessons/CurriculumLibrary.tsx*", (route) =>
    route.abort(),
  );
  await page.goto("/#/lab/library");
  await expect(
    page.getByRole("heading", { name: "This workspace could not load" }),
  ).toBeVisible();
  await expect(
    page.getByRole("navigation", { name: "Main navigation" }),
  ).toBeVisible();
  await page.unroute("**/lessons/CurriculumLibrary.tsx*");
  await page.getByRole("button", { name: "Retry workspace" }).click();
  await expect(
    page.getByRole("button", { name: "Reload and retry download" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Reload and retry download" }).click();
  await expect(page.locator("main h1")).toContainText(
    "Explore your learning path",
  );
});
test("mission recovery survives repeated navigation", async ({ page }) => {
  await page.goto("/#/lab/neuron");
  await page.getByRole("button", { name: "Load the challenge" }).click();
  await page.getByRole("button", { name: "My learning" }).click();
  await page.getByRole("link", { name: "Learn", exact: true }).click();
  await page.getByRole("button", { name: "Restore my experiment" }).click();
  await expect(page.getByRole("slider", { name: "Bias b" })).toHaveValue("0.5");
});
test("inspector tabs implement roving focus and linked panel", async ({
  page,
}) => {
  await page.goto("/#/lab/neuron");
  await page.getByRole("tab", { name: "Math" }).focus();
  await page.keyboard.press("ArrowRight");
  await expect(page.getByRole("tab", { name: "Code" })).toBeFocused();
  await expect(page.getByRole("tabpanel")).toHaveAttribute(
    "aria-labelledby",
    "inspector-code",
  );
  await page.keyboard.press("End");
  await expect(page.getByRole("tab", { name: "Challenge" })).toBeFocused();
  await page.keyboard.press("Home");
  await expect(page.getByRole("tab", { name: "Math" })).toBeFocused();
});
test("drawer isolates background and restores focus", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/#/lab/neuron");
  const trigger = page.getByRole("button", {
    name: "Toggle lesson navigation",
  });
  await trigger.click();
  await expect(page.locator("header")).toHaveAttribute("inert", "");
  await expect(page.locator("main")).toHaveAttribute("inert", "");
  for (let i = 0; i < 35; i++) await page.keyboard.press("Tab");
  expect(
    await page
      .getByRole("dialog")
      .evaluate((el) => el.contains(document.activeElement)),
  ).toBeTruthy();
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();
});
test("Space selects an exact gradient layer", async ({ page }) => {
  await page.goto("/#/lab/gradient-depth");
  await page
    .getByRole("button", { name: "Inspect layer 3", exact: true })
    .focus();
  await page.keyboard.press("Space");
  await expect(page.getByTestId("depth-local-step")).toContainText("Layer 3");
});
test("invalid matrix drafts retain calculation and can be corrected", async ({
  page,
}) => {
  await page.goto("/#/lab/math-workshop");
  const cell = page.getByRole("textbox", { name: "B[0,0]" });
  const before = await page.getByTestId("matrix-cell-equation").innerText();
  for (const value of ["999", "", "-", "Infinity"]) {
    await cell.fill(value);
    await expect(cell).toHaveValue(value);
    await expect(cell).toHaveAttribute("aria-invalid", "true");
    await expect(page.getByTestId("matrix-cell-equation")).toHaveText(before);
  }
  await cell.fill("3");
  await expect(cell).toHaveAttribute("aria-invalid", "false");
  await expect(page.getByTestId("matrix-cell-equation")).not.toHaveText(before);
});
test("dashboard announces empty matches and clears search", async ({
  page,
}) => {
  await page.goto("/#/lab/dashboard");
  await page
    .getByRole("searchbox", { name: "Search title or term" })
    .fill("zzzz-no-match");
  await expect(
    page.getByRole("status").filter({ hasText: "No topics match" }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Clear search and show all topics" })
    .click();
  await expect(page.locator(".glossary-results article")).toHaveCount(60);
});
test("beginner prediction is within two viewports and review follows topic", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 844 });
  await page.goto("/#/lab/beginner");
  const prediction = page.getByRole("spinbutton", {
    name: "Your prediction",
    exact: true,
  });
  expect((await prediction.boundingBox())!.y).toBeLessThan(1688);
  await page.locator(".topic-navigation summary").click();
  await page
    .getByRole("link", { name: "Training diagnostics", exact: true })
    .click();
  await expect(page).toHaveURL(/topic=/);
  await expect(page.getByLabel("Review chapter")).toHaveValue("7");
  await page.reload();
  await expect(
    page.locator('article[aria-label="Beginner lesson"] h2'),
  ).toHaveText("Training diagnostics");
});
test("library opens detail near top and restores search", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 844 });
  await page.goto("/#/lab/library");
  await page.getByRole("searchbox", { name: "Search topics" }).fill("python");
  await page
    .getByRole("link", { name: /Read .* specification/ })
    .first()
    .click();
  await expect(page).toHaveURL(/document=/);
  expect(
    (await page.getByRole("heading", { level: 2 }).last().boundingBox())?.y,
  ).not.toBeUndefined();
  await expect(
    page.getByRole("button", { name: "Back to search results" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Back to search results" }).click();
  await expect(
    page.getByRole("searchbox", { name: "Search topics" }),
  ).toHaveValue("python");
});

test("nested topic links support Back, Forward and invalid selection fallback", async ({
  page,
}) => {
  await page.goto("/#/lab/beginner");
  await page.locator(".topic-navigation summary").click();
  await page
    .getByRole("link", { name: "Training diagnostics", exact: true })
    .click();
  const diagnostics = page.url();
  await page
    .getByRole("link", { name: "Weights and biases", exact: true })
    .click();
  await page.goBack();
  await expect(page).toHaveURL(diagnostics);
  await expect(
    page.locator('article[aria-label="Beginner lesson"] h2'),
  ).toHaveText("Training diagnostics");
  await page.goForward();
  await expect(
    page.locator('article[aria-label="Beginner lesson"] h2'),
  ).toHaveText("Weights and biases");
  await page.goto("/#/lab/beginner?topic=invalid");
  await expect(
    page.locator('article[aria-label="Beginner lesson"] h2'),
  ).toBeVisible();
});
test("resumable sandbox drafts keep prediction but require a new Python execution", async ({
  page,
}) => {
  await page.goto("/#/lab/python-basics");
  await page
    .getByRole("spinbutton", { name: "Starting x", exact: true })
    .fill("-3");
  await page
    .getByRole("spinbutton", {
      name: "Predict the stored product",
      exact: true,
    })
    .fill("-9");
  await page.reload();
  await expect(
    page.getByRole("spinbutton", { name: "Starting x", exact: true }),
  ).toHaveValue("-3");
  await expect(
    page.getByRole("spinbutton", {
      name: "Predict the stored product",
      exact: true,
    }),
  ).toHaveValue("-9");
  await expect(page.getByTestId("variable-product")).toContainText(
    "Not assigned",
  );
});
test("fresh transfer predictions hide results until submission and preserve course isolation", async ({
  page,
}) => {
  await page.goto("/#/lab/tensor");
  const task = page.getByRole("region", { name: "Fresh transfer prediction" });
  await expect(task.getByRole("status")).toHaveCount(0);
  await task.getByRole("spinbutton", { name: "Transfer prediction" }).fill("6");
  await task.getByRole("button", { name: "Check transfer prediction" }).click();
  await expect(task.getByRole("status")).toContainText("Prediction matched");
  await page.goto("/#/lab/activation");
  const activation = page.getByRole("region", {
    name: "Fresh transfer prediction",
  });
  await activation
    .getByRole("spinbutton", { name: "Transfer prediction" })
    .fill("-0.35");
  await activation
    .getByRole("button", { name: "Check transfer prediction" })
    .click();
  await expect(activation.getByRole("status")).toContainText(
    "Prediction matched",
  );
  await page.goto("/#/lab/perceptron");
  await page.getByRole("button", { name: "Test XOR boundary" }).click();
  await expect(
    page
      .getByRole("region", { name: "Construct an XOR boundary" })
      .getByRole("status"),
  ).toContainText("3 / 4");
});

test("failed reference document can recover its exact URL by reload", async ({
  page,
}) => {
  await page.route(
    "**/curriculum/deep-learning/00-python-and-math/README.md*",
    (route) => route.abort(),
  );
  await page.goto("/#/lab/library?document=00-python-and-math%2FREADME.md");
  await expect(page.getByRole("alert")).toContainText(
    "Document could not load",
  );
  await page.unroute(
    "**/curriculum/deep-learning/00-python-and-math/README.md*",
  );
  await page
    .getByRole("button", { name: "Reload and retry document download" })
    .click();
  await expect(page.locator(".markdown-document h1").first()).toBeVisible();
  await expect(page).toHaveURL(/document=00-python-and-math%2FREADME.md/);
});

test("Markdown references expose exact native deep links for a new tab", async ({
  page,
  context,
}) => {
  await page.goto("/#/lab/library?document=00-python-and-math%2FREADME.md");
  const reference = page.getByRole("link", {
    name: "From symbols to executable Python",
    exact: true,
  });
  const href = await reference.getAttribute("href");
  expect(href).toMatch(/^#\/lab\/library\?document=/);
  const original = page.url();
  const [popup] = await Promise.all([
    context.waitForEvent("page"),
    reference.click({ modifiers: ["Control"] }),
  ]);
  await expect(popup.locator(".markdown-document h1").first()).toBeVisible();
  await expect(page).toHaveURL(original);
  expect(popup.url()).toContain(href!);
  await popup.close();
});
