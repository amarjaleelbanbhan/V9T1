# Reproduce the evidence

Use Node 24, the repository's installed dependencies and Chromium. Build with `npm run build`, then run `npm run preview -- --host 127.0.0.1 --port 4176`. The screenshot, interaction, contrast and production-probe scripts use that preview. `navigation-final.mjs` uses the dev server on port 4173, matching the browser tests.

From the repository root:

```
node docs/audit/tools/capture.mjs
NEURALLAB_PYODIDE_ASSETS=/path/to/authentic/pyodide-0.27.7 node docs/audit/tools/interactions.mjs
node docs/audit/tools/probes-final.mjs
node docs/audit/tools/contrast-final.mjs
node docs/audit/tools/navigation-final.mjs
```

The runtime mirror fixture serves actual pinned files and does not replace execution or outputs. Without the mirror, the interaction script uses the original CDN. Scripts use `/usr/bin/chromium`; adjust the executable path for another system. Evidence is written to `docs/audit/evidence/after`. Preserve a copy before regeneration.

`axe.min.js` is the original audit's axe-core 4.10.3 distribution; its MPL-2.0 license notice is retained. Axe incomplete checks are intentionally recorded. Review those and keyboard/visual state evidence; a zero-violation result is not a certification.
