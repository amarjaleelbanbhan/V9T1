# Dependency and license decisions

Checked installed package manifests on 2026-10-10. Exact versions of new direct dependencies are pinned in package.json. Package source links and shipped license files provide attribution; bundlers retain applicable license comments. All selected software is free; no paid service or API is used.

| Package | Installed version | Declared license | Upstream |
| --- | --- | --- | --- |
| ts-fsrs | 5.4.2 | MIT | git+https://github.com/open-spaced-repetition/ts-fsrs.git |
| @codemirror/state | 6.7.6 | MIT | https://github.com/codemirror/state |
| codemirror | 6.0.2 | MIT | https://github.com/codemirror/basic-setup.git |
| @codemirror/lang-python | 6.2.1 | MIT | https://github.com/codemirror/lang-python.git |
| @codemirror/theme-one-dark | 6.1.3 | MIT | https://github.com/codemirror/theme-one-dark.git |
| remark-math | 6.0.0 | MIT | https://github.com/remarkjs/remark-math/tree/main/packages/remark-math |
| rehype-katex | 7.0.1 | MIT | https://github.com/remarkjs/remark-math/tree/main/packages/rehype-katex |
| katex | 0.16.47 | MIT | https://github.com/KaTeX/KaTeX.git |
| rehype-highlight | 7.0.2 | MIT | rehypejs/rehype-highlight |
| highlight.js | 11.11.2 | BSD-3-Clause | git://github.com/highlightjs/highlight.js.git |
| react-markdown | 10.1.0 | MIT | remarkjs/react-markdown |
| remark-gfm | 4.0.1 | MIT | remarkjs/remark-gfm |
| three | 0.175.0 | MIT | https://github.com/mrdoob/three.js |
| @react-three/fiber | 9.8.1 | MIT | git+https://github.com/pmndrs/react-three-fiber.git |
| @react-three/drei | 10.7.9 | MIT | git+https://github.com/pmndrs/drei.git |

## Selection

- Keep Three, R3F and Drei: existing React 19 integration, camera controls, performance monitor and resource lifecycle. Native scene labels avoid remote fonts. No second graphics framework.
- ts-fsrs: maintained scheduler, default model and explicit four-grade ratings; no custom interval formula or falsely claimed personalized parameter fitting. npm registry reported 5.4.2 modified 2026-10-09 at the audit.
- CodeMirror 6: Python grammar, editor keyboard handling, line wrapping, undo and selection. Loaded only for the editable workshop.
- remark-math + rehype-katex: HTML plus MathML, bundled fonts, trust=false, bounded expansion; arbitrary Markdown HTML remains disabled.
- rehype-highlight: authored fenced Python gets syntax highlighting; automatic language guessing disabled.
- Keep existing SVG visuals and Pyodide 0.27.7/NumPy 2.0.2. Worker isolate is terminated on cancel/error/timeout. No PyTorch or TensorFlow installation is claimed.

## Alternatives evaluated

| Option | Decision and reason |
| --- | --- |
| React Flow | No editable topology is required for this fixed beginner network. Adds another graph/state layer without a learning gain here. |
| D3 | Existing SVG and small exact engines cover these curves and 2×2 matrices; avoid a duplicate drawing stack. |
| Monaco | Heavier editor than needed for three Python exercises; choose CodeMirror. |
| MathJax | KaTeX covers the authored beginner formulas with synchronous output and MathML. |
| Paid LLM explanation grading | Excluded by zero-budget constraint. Structured self-review explicitly avoids automatic understanding claims. |

## Cost and loading

Static client application; no server database, paid inference or purchased assets. Vercel hosting stays on the existing configuration; free-tier usage limits still apply. First Python execution requires CDN downloads. Loaded Python can run authored examples in the current worker; offline reload is not guaranteed. CodeMirror, 3D and the Markdown reader are lazy chunks. Initial app JS fell from approximately 1,265 KB to 266 KB minified before final verification; large optional Three and Markdown chunks remain.
