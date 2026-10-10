# Fix NeuralLab audit defects across all 18 workspaces

A rejected workspace download previously removed the app shell, mission recovery vanished on navigation, mobile mathematics became unreadable, and course/library flows buried the actual task. This change contains download failures, preserves recovery, implements the drawer/tab/keyboard contracts, and provides readable mathematical equivalents beside the controls.

The learning flows now support exact topic/document URLs, contextual chapter review, a compact library reader with every reference discoverable, bounded resumable sandbox drafts, explicit matrix validation, readable chart scales, and fresh prediction/XOR experiments. Execution actions and editor colors have explicit owners. Mathematical engines, genuine Python, the 60 authored lessons, FSRS, hint provenance and inference checkpoint semantics remain.

Validation: ESLint, TypeScript/production build, 257 unit tests, the full 77-test browser run, 10 targeted library/navigation/Markdown checks and curriculum validation pass. Evidence includes matching before/after screenshots for 18 routes at 320/390/768/1280/1440px, 19 changed-state checks, production failure/recovery and keyboard probes, and 36 initial-state axe scans with no violations. Python tests use genuine pinned Pyodide assets, with separate failed-download/cancel/stale-result checks.

Review `docs/AUDIT_REMEDIATION.md`, `docs/AUDIT_COMPARISON.md` and `docs/audit/GALLERY.md`. No learner-outcome improvement or accessibility certification is claimed. Existing large lazy chunks retain Vite's size advisory. The CLI token is invalid; the connected GitHub app is used to prepare the reviewable PR. No merge is requested.
