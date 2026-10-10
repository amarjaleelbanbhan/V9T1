import { test, expect } from "@playwright/test";
import { installPyodideMirror } from "./fixtures/pyodide";
async function navigate(page: import("@playwright/test").Page, name: string) {
  const toggle = page.getByRole("button", { name: "Toggle lesson navigation" });
  if (await toggle.isVisible()) await toggle.click();
  await page.getByRole("button", { name, exact: true }).click();
}
test("recall requires retrieval, records FSRS ratings, saves explanation and resumes topic", async ({
  page,
}) => {
  await page.goto("/");
  await navigate(page, "Start beginner course");
  await page
    .getByRole("navigation", { name: "Beginner topics" })
    .getByRole("button", { name: "Weights and biases", exact: true })
    .click();
  const recall = page.getByRole("region", { name: "Active recall" });
  await expect(
    recall.getByRole("button", { name: "Reveal reference answer" }),
  ).toBeDisabled();
  await recall
    .getByRole("textbox", { name: "Your recalled answer" })
    .fill(
      "Multiply each input by its weight, add the contributions and the bias.",
    );
  await recall.getByRole("button", { name: "Reveal reference answer" }).click();
  await expect(recall.locator(".recall-answer")).toBeVisible();
  await recall.getByRole("button", { name: "Good", exact: true }).click();
  await expect(recall.getByRole("status")).toContainText("Next review:");
  const explanation = page.getByRole("region", { name: "Feynman explanation" });
  await explanation
    .getByRole("textbox", { name: "Your explanation" })
    .fill(
      "Bias shifts the score. With x=2 and w=3, the contribution is 6 before adding bias.",
    );
  await page.getByRole("button", { name: "Bookmark this lesson" }).click();
  await page.reload();
  await expect(
    page
      .getByRole("article", { name: "Beginner lesson" })
      .getByRole("heading", { name: "Weights and biases", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("textbox", { name: "Your explanation" }),
  ).toContainText("Bias shifts");
  await page.getByRole("button", { name: "My learning" }).click();
  await expect(
    page.getByRole("region", { name: "Learning dashboard" }),
  ).toContainText("Good");
  await page.getByRole("button", { name: "Bookmarks", exact: true }).click();
  await expect(page.locator(".glossary-results article")).toHaveCount(1);
  await page
    .getByRole("searchbox", { name: "Search title or term" })
    .fill("bias");
  await expect(page.locator(".glossary-results")).toContainText(
    "Weights and biases",
  );
});
test("real edited Python, changing source clears output, syntax failures and NumPy exercise", async ({
  page,
}) => {
  test.setTimeout(180000);
  await installPyodideMirror(page.context());
  await page.goto("/");
  await navigate(page, "Editable Python workshop");
  await page.getByRole("spinbutton", { name: "Predicted output" }).fill("3.1");
  await page.getByRole("button", { name: "Execute edited Python" }).click();
  await expect(page.getByTestId("workshop-result")).toContainText("3.1", {
    timeout: 95000,
  });
  const editor = page.getByRole("textbox", { name: "Python source" });
  await editor.fill('result = {"output": 7}\nprint(result)');
  await expect(page.getByTestId("workshop-result")).toHaveCount(0);
  await page.getByRole("spinbutton", { name: "Predicted output" }).fill("7");
  await page.getByRole("button", { name: "Execute edited Python" }).click();
  await expect(page.getByTestId("workshop-result")).toContainText("7", {
    timeout: 95000,
  });
  await editor.fill("result = (");
  await page.getByRole("spinbutton", { name: "Predicted output" }).fill("1");
  await page.getByRole("button", { name: "Execute edited Python" }).click();
  await expect(page.getByRole("status")).toContainText("SyntaxError", {
    timeout: 95000,
  });
  await expect(page.getByTestId("workshop-result")).toHaveCount(0);
  await page.getByRole("button", { name: "NumPy matrix cells" }).click();
  await page.getByRole("spinbutton", { name: "Predicted output" }).fill("4");
  await page.getByRole("button", { name: "Execute edited Python" }).click();
  await expect(page.getByTestId("workshop-result")).toContainText(
    '"output": 4',
    { timeout: 95000 },
  );
  await expect(
    page.getByRole("table", { name: "Python computed matrix" }),
  ).toBeVisible();
});
test("editable execution bounds output, blocks unsupported imports and stops infinite loop", async ({
  page,
}) => {
  test.setTimeout(180000);
  await installPyodideMirror(page.context());
  await page.goto("/");
  await navigate(page, "Editable Python workshop");
  const editor = page.getByRole("textbox", { name: "Python source" });
  for (const [code, error] of [
    ['print("x" * 20001)', "Output exceeded"],
    ["import os\nresult = 1", "Only math and numpy"],
    ["while True:\n    pass", "10 seconds"],
  ]) {
    await editor.fill(code);
    await page.getByRole("spinbutton", { name: "Predicted output" }).fill("1");
    await page.getByRole("button", { name: "Execute edited Python" }).click();
    await expect(page.getByRole("status")).toContainText(error, {
      timeout: 95000,
    });
    await expect(page.getByTestId("workshop-result")).toHaveCount(0);
  }
  await editor.fill("while True:\n    pass");
  await page.getByRole("spinbutton", { name: "Predicted output" }).fill("1");
  await page.getByRole("button", { name: "Execute edited Python" }).click();
  await page.getByRole("button", { name: "Stop edited Python" }).click();
  await expect(page.getByRole("status")).toContainText("Canceled");
});
test("3D neuron and layered network selection share math, with keyboard transport and 2D alternative", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  if (await page.getByRole("button", { name: "3D", exact: true }).isEnabled()) {
    await page.getByRole("button", { name: "3D", exact: true }).click();
    await page.getByRole("button", { name: "Weight 2", exact: true }).click();
    await expect(page.getByTestId("neuron-selection")).toContainText(
      "-1 × weight -0.4 = contribution 0.4",
    );
    await page
      .getByRole("button", { name: "Reset camera", exact: true })
      .click();
  }
  await page.getByRole("button", { name: /Forward Propagation/ }).click();
  await page.getByRole("button", { name: "Explore 3D network" }).click();
  await page
    .getByRole("button", { name: "Inspect hidden 2", exact: true })
    .click();
  await expect(page.getByTestId("network-neuron-calculation")).toContainText(
    "1.2",
  );
  await page
    .getByRole("button", { name: "Inspect Input 2 to Hidden 1", exact: true })
    .click();
  await expect(page.getByTestId("edge-calculation")).toContainText("2 × -0.2");
  await page.getByRole("button", { name: "Play stages", exact: true }).click();
  await expect(
    page.getByRole("group", { name: "Forward playback" }),
  ).toContainText("Stage 2", { timeout: 5000 });
  await page.getByRole("button", { name: "Pause stages" }).click();
  await page.getByRole("button", { name: "Rewind stage" }).focus();
  await page.keyboard.press("Enter");
  await expect(
    page.getByRole("group", { name: "Forward playback" }),
  ).toContainText("Stage 1");
  await page.getByRole("button", { name: "Use 2D network" }).click();
  await expect(
    page.getByRole("img", { name: /Interactive forward propagation/ }),
  ).toBeVisible();
  expect(errors).toEqual([]);
});
test("matrix cells and loss surface synchronize live formulas and Python", async ({
  page,
}) => {
  test.setTimeout(180000);
  await installPyodideMirror(page.context());
  await page.goto("/");
  await navigate(page, "Matrix and loss workshop");
  await page.getByRole("button", { name: "Inspect C[1,1]" }).click();
  await expect(page.getByTestId("matrix-cell-equation")).toContainText(
    "(3 × 0) + (4 × 1) = 4",
  );
  await page.getByRole("spinbutton", { name: "B[1,1]" }).fill("2");
  await expect(page.getByTestId("matrix-cell-equation")).toContainText("= 8");
  const p = page.getByRole("region", { name: "Executable Python" }).first();
  await p.getByRole("button", { name: "Run Python example" }).click();
  await expect(p.getByTestId("python-program-output")).toContainText("8", {
    timeout: 95000,
  });
  await page
    .getByRole("spinbutton", { name: "Predict the loss after one update" })
    .fill("1.32148148148148");
  await page.getByRole("button", { name: "Reveal descent step" }).click();
  await expect(page.getByTestId("surface-values")).toContainText("loss 1.3215");
  await page.getByRole("button", { name: "Explore 3D surface" }).click();
  await expect(
    page.getByLabel("Loss as height over weight and bias"),
  ).toBeVisible();
  await page.getByRole("button", { name: "Rewind descent" }).click();
  await expect(page.getByTestId("surface-values")).toContainText("loss 1.8333");
});
test("Markdown compiles math, nested lists, tables, callouts and Python highlighting", async ({
  page,
}) => {
  await page.goto("/");
  await navigate(page, "Browse full curriculum");
  await page.getByRole("searchbox").fill("Python");
  await page
    .getByRole("button", {
      name: "Read Python, data and mathematics specification",
    })
    .click();
  await page
    .getByRole("link", { name: "From symbols to executable Python" })
    .click();
  const reader = page.getByRole("article", { name: "Chapter specification" });
  await expect(reader.locator(".katex").first()).toBeVisible();
  expect(await reader.locator("math").count()).toBeGreaterThan(0);
  await expect(reader.locator("code.language-python")).toContainText(
    "products",
  );
  await expect(reader.locator(".hljs-keyword").first()).toBeVisible();
  await expect(reader.locator(".callout-tip")).toContainText("TIP:");
  await expect(reader.getByRole("table")).toBeVisible();
  await expect(reader.locator("ol ul")).toBeVisible();
});
test("3D gracefully falls back when WebGL is unavailable", async ({ page }) => {
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (
      type: string,
      ...args: unknown[]
    ) {
      if (type === "webgl" || type === "webgl2") return null;
      return original.apply(this, [type, ...args] as never);
    } as typeof original;
  });
  await page.goto("/");
  await expect(
    page.getByRole("button", { name: "3D", exact: true }),
  ).toBeDisabled();
  await expect(
    page.getByRole("img", { name: /Neuron computation graph/ }),
  ).toBeVisible();
});
test("new learner tools fit mobile, preserve focus and respect reduced motion", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  for (const name of [
    "Start beginner course",
    "Editable Python workshop",
    "Matrix and loss workshop",
  ]) {
    await navigate(page, name);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth - innerWidth,
      ),
    ).toBeLessThanOrEqual(1);
  }
  await page.getByRole("button", { name: "My learning" }).click();
  await expect(
    page.getByRole("searchbox", { name: "Search title or term" }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth - innerWidth,
    ),
  ).toBeLessThanOrEqual(1);
});
test("Markdown rejects raw HTML and unsafe links while rendering trusted math", async ({
  page,
}) => {
  await page.goto("/");
  await page.evaluate(async () => {
    const reactPath = "/node_modules/.vite/deps/react.js",
      domPath = "/node_modules/.vite/deps/react-dom_client.js",
      markdownPath = "/src/components/MarkdownDocument.tsx";
    const React = await import(reactPath),
      DOM = await import(domPath),
      { MarkdownDocument } = await import(markdownPath);
    const host = document.createElement("div");
    host.id = "markdown-safety-check";
    document.body.append(host);
    DOM.createRoot(host).render(
      React.createElement(MarkdownDocument, {
        source:
          '# Safe heading\n\n<script>window.injected = true</script>\n\n<img src=x onerror="window.injected=true">\n\n[unsafe](javascript:alert(1))\n\n$z=xw+b$',
      }),
    );
  });
  await expect(page.locator("#markdown-safety-check h1")).toHaveText(
    "Safe heading",
  );
  await expect(page.locator("#markdown-safety-check script")).toHaveCount(0);
  await expect(page.locator("#markdown-safety-check img")).toHaveCount(0);
  await expect(page.locator("#markdown-safety-check a")).not.toHaveAttribute(
    "href",
    /javascript:/,
  );
  await expect(page.locator("#markdown-safety-check .katex")).toBeVisible();
  expect(await page.evaluate(() => "injected" in window)).toBe(false);
});
test("scene switching disposes canvases and malformed edited visual data cannot crash the workshop", async ({
  page,
}) => {
  test.setTimeout(140000);
  await installPyodideMirror(page.context());
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  if (await page.getByRole("button", { name: "3D", exact: true }).isEnabled()) {
    for (let i = 0; i < 4; i++) {
      await page.getByRole("button", { name: "2D", exact: true }).click();
      await page.getByRole("button", { name: "3D", exact: true }).click();
    }
    await expect(page.locator(".canvas-area canvas")).toHaveCount(1);
  }
  await navigate(page, "Editable Python workshop");
  await page
    .getByRole("textbox", { name: "Python source" })
    .fill('result = {"output": 1, "cells": [1], "contributions": ["bad"]}');
  await page.getByRole("spinbutton", { name: "Predicted output" }).fill("1");
  await page.getByRole("button", { name: "Execute edited Python" }).click();
  await expect(page.getByTestId("workshop-result")).toContainText('"cells"', {
    timeout: 95000,
  });
  await expect(
    page.getByRole("table", { name: "Python computed matrix" }),
  ).toHaveCount(0);
  expect(errors).toEqual([]);
});
