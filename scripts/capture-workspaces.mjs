import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';

const phase = process.argv[2] || 'before';
if (!['before', 'after'].includes(phase)) throw Error('Choose before or after.');
const root = `${process.env.NEURALLAB_EVIDENCE_DIR || '/workspace/v9t1-evidence'}/${phase}`;
const port = process.env.CAPTURE_PORT || '4173';
const workspaces = ['neuron', 'python-basics', 'python-flow', 'intro', 'perceptron', 'tensor', 'propagation', 'backprop', 'activation', 'loss', 'gradient-depth', 'beginner', 'training-project', 'library', 'python', 'dashboard', 'python-workshop', 'math-workshop'];
await mkdir(root, { recursive: true });
const browser = await chromium.launch(process.env.NEURALLAB_CHROMIUM
  ? { executablePath: process.env.NEURALLAB_CHROMIUM }
  : {});
const results = [];
try {
  for (const [size, width, height] of [['desktop', 1440, 1000], ['mobile', 390, 844]]) {
    const context = await browser.newContext({ viewport: { width, height }, reducedMotion: 'reduce' });
    try {
      for (const id of workspaces) {
        const page = await context.newPage();
        try {
          // Initialize before React mounts: a reload after changing storage can race resume effects.
          await page.addInitScript(id => {
            localStorage.clear();
            localStorage.setItem('neurallab.workspace', id);
          }, id);
          await page.goto(`http://127.0.0.1:${port}/#/lab/${id}`, { waitUntil: 'domcontentloaded' });
          await page.locator('main h1').waitFor();
          await page.waitForTimeout(350);
          await page.screenshot({ path: `${root}/${id}-${size}.png`, fullPage: true });
          results.push({
            id, size, heading: await page.locator('main h1').innerText(),
            overflow: await page.evaluate(() => document.documentElement.scrollWidth > innerWidth),
            buttons: await page.locator('main button').count(),
          });
          console.log(size, id);
        } finally {
          await page.close();
        }
      }
    } finally {
      await context.close();
    }
  }
  await writeFile(`${root}/inventory.json`, JSON.stringify(results, null, 2));
} finally {
  await browser.close();
}
