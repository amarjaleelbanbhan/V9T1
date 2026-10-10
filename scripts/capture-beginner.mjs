import { chromium } from "@playwright/test";
import { spawn } from "node:child_process";
import fs from "node:fs";
const server = spawn(
  "npm",
  ["run", "dev", "--", "--host", "127.0.0.1", "--port", "4173"],
  { stdio: "ignore" },
);
let browser;
try {
  for (let i = 0; i < 100; i++) {
    try {
      await fetch("http://127.0.0.1:4173");
      break;
    } catch {
      await new Promise((r) => setTimeout(r, 100));
    }
  }
  browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
  });
  fs.mkdirSync("docs/beginner-evidence", { recursive: true });
  await page.goto("http://127.0.0.1:4173");
  await page.getByTestId("neuron-selection").waitFor();
  await page.waitForTimeout(500);
  await page.evaluate(() => scrollTo(0, 0));
  await page.screenshot({
    path: "docs/beginner-evidence/neuron-after.png",
    fullPage: true,
  });
  await page.getByRole("button", { name: /Forward Propagation/ }).click();
  await page.getByRole("button", { name: "Explore 3D network" }).click();
  await page
    .getByRole("button", { name: "Inspect hidden 2", exact: true })
    .click();
  await page.waitForTimeout(500);
  await page.evaluate(() => scrollTo(0, 0));
  await page.screenshot({
    path: "docs/beginner-evidence/network-after.png",
    fullPage: true,
  });
  await page
    .getByRole("button", { name: "Start beginner course", exact: true })
    .click();
  await page.getByRole("region", { name: "Active recall" }).waitFor();
  await page.evaluate(() => scrollTo(0, 0));
  await page.screenshot({
    path: "docs/beginner-evidence/course-after.png",
    fullPage: true,
  });
  await page.getByRole("button", { name: "Matrix and loss workshop" }).click();
  await page.getByRole("button", { name: "Explore 3D surface" }).click();
  await page.waitForTimeout(500);
  await page.evaluate(() => scrollTo(0, 0));
  await page.screenshot({
    path: "docs/beginner-evidence/surface-after.png",
    fullPage: true,
  });
  await page.getByRole("button", { name: "My learning" }).click();
  await page.getByRole("region", { name: "Learning dashboard" }).waitFor();
  await page.evaluate(() => scrollTo(0, 0));
  await page.screenshot({
    path: "docs/beginner-evidence/dashboard-after.png",
    fullPage: true,
  });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.evaluate(() => scrollTo(0, 0));
  await page.screenshot({
    path: "docs/beginner-evidence/dashboard-mobile.png",
    fullPage: true,
  });
  console.log("Saved six screenshots.");
} finally {
  await browser?.close();
  server.kill();
}
