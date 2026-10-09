# Loops, functions and objects

A list stores items in order. A loop visits each item. An if condition decides which indented instructions run. For [2, -1, 3], adding only positive values gives 5. The loop still reads -1; its addition is skipped. For [1, -3, 2], the result is 3.

A function gives reusable instructions a name. Each call to double receives one value, computes a local result, and returns it. With [2, -1, 3], outputs are [4, -2, 6], so the sum is 8. With [1, -3, 2], outputs are [2, -6, 4], so the sum is zero. A local name does not automatically become global. Inspect the double scope in the captured trace.

A class describes objects. Each Counter instance stores its own total attribute; self identifies the current instance in a method. Adding [2, -1, 3] yields 4; [1, -3, 2] yields zero. The attribute persists between method calls. A second newly constructed counter would start at zero independently.

## Practice

Predict each result before execution. Replay repeated lines, inspect scopes and output, then answer the explanation question. Repeat for a changed list. Incorrect predictions do not earn evidence. Evidence lasts only during this lesson visit. This bounded exercise does not establish general programming mastery.

## Debugging

Moving total = 0 inside the loop loses earlier additions. Returning from inside a loop exits the function early. Replacing self.total with a local total no longer updates the instance. Explain each defect before repairing it.

## Mini-project

On paper or in your own Python environment, implement a counter that accepts only positive values. Predict [2, -1, 3] -> 5 and [1, -3, 2] -> 3. Explain why the condition belongs inside the method or before the call. Check that two counters remain independent.

## Sources and runtime

Original examples, checked against Python 3.12 control flow and class documentation. https://docs.python.org/3.12/tutorial/controlflow.html and https://docs.python.org/3.12/tutorial/classes.html. The app executes fixed trusted code in Pyodide 0.27.7. Stepping replays captured execution, including function-local values; it does not pause a live interpreter. Arbitrary code editing is not supported.
