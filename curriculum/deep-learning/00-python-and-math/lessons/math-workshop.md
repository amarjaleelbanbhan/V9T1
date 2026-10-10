# From symbols to executable Python

## One neuron, three representations

A neuron first forms a weighted sum, then adds bias and applies an activation:

$$
z = \sum_{i=1}^{3} x_i w_i + b, \qquad a = \max(0,z).
$$

For $\mathbf{x}=(2,-1,0.5)$, $\mathbf{w}=(0.8,-0.4,1.2)$ and $b=0.5$, the contributions are $1.6$, $0.4$ and $0.6$. Thus $z=3.1$ and ReLU returns $a=3.1$.

> [!TIP]
> Predict the contribution of the negative input before revealing it. A negative input times a negative weight gives a positive contribution.

```python
inputs = [2, -1, 0.5]
weights = [0.8, -0.4, 1.2]
bias = 0.5
products = [x * w for x, w in zip(inputs, weights)]
z = sum(products) + bias
result = max(0, z)
print(products, z, result)
```

| Representation | What to inspect |
| --- | --- |
| Equation | Products, sum, bias and activation |
| 2D or 3D scene | Select a connection or neuron; compare the exact values |
| Executed Python | Contributions and output from the current input values |

## Matrix multiplication is a contraction

$$
C_{ij}=\sum_k A_{ik} B_{kj}.
$$

1. Choose a row of $A$ and a column of $B$.
   - Multiply the entries with the same shared index $k$.
   - Add those products into one output cell.
2. Repeat for another cell. The inner dimensions must agree.

The Matrix and loss workshop lets you select a cell, edit either matrix, and run NumPy with those same values.

## A two-parameter loss landscape

For points $(-1,-1),(0,1),(1,3)$ and model $\hat y=wx+b$:

$$
L(w,b)=\frac{1}{3}\sum_{n=1}^{3}\frac12(wx_n+b-y_n)^2
      =\frac{(w-2)^2}{3}+\frac{(b-1)^2}{2}.
$$

$$
\frac{\partial L}{\partial w}=\frac23(w-2),\qquad
\frac{\partial L}{\partial b}=b-1.
$$

Gradient descent subtracts $\eta$ times each derivative. At $w=b=0$ and $\eta=0.2$, the next parameters are $w=4/15$, $b=1/5$. The loss falls from $11/6$ to about $1.3215$.

> [!NOTE]
> Surface height is clipped for readability at loss 12. The numerical inspector retains the exact value. The minimum of this particular convex example does not imply that all neural-network losses are convex.

## Recall and apply

Close the answer and explain why the negative weight contribution is positive. Reconstruct the matrix-cell formula, then predict a changed cell before running NumPy. Finally, teach the difference between a forward pass and a gradient update in the saved explanation workspace.
