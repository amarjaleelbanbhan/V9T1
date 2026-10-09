# Execution architecture

Use pinned Pyodide in a dedicated disposable Worker for a bounded original NumPy example. Runtime boot is asynchronous; terminate worker on cancel, timeout and unmount. Do not claim workers alone are security sandboxes: they can access network/worker globals. The first prototype accepts numeric inputs only and generates fixed trusted Python; it is not an arbitrary-code editor.

Trace schema: version, mode (executed-python / inspected-python / educational-simulation / prerecorded), source, frames {line,phase,variables,stdout}; tensor snapshots {shape,rank,dtype,values,payload_bytes}. Line trace callbacks run before a line: captured variables reflect preceding completed statements. Final frame reflects completed execution. nbytes is measured payload, excluding object/runtime overhead.

Fixed code avoids imports outside NumPy and prevents user-authored filesystem/network code. Future arbitrary code needs capability limits beyond AST filtering, deployment CSP, package allowlists, output/step/resource budgets and isolation review. Heavy framework training requires a separately secured remote service or an explicitly labeled TypeScript teaching engine. No unrestricted server execution. No paid backend required for this bounded prototype; CDN bandwidth/offline behavior still needs measurement.
