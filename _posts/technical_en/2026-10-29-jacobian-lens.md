---
layout: post
title: "The Jacobian Lens: Response Magnitude and Coherence"
permalink: /blog/2026/jacobian-lens-en/
mini-title: "Jacobian Lens"
---

## 1. Two ways to read the same state

*The bird can fly.* At the word *bird*, a model's hidden state might carry information about species such as Eagle and Penguin, along with actions such as Fly. What we see in that state depends on how we read it. The **Logit Lens** passes it directly to the unembedding. The **Jacobian Lens (J-lens)** first transforms it using a map of how changes in that state affect later representations.

The demo below makes this difference visible. Choose **bird** in the input row, then switch between Logit Lens and J-lens. With the input fixed, selecting different upper nodes leaves the direct Logit Lens readout unchanged. For J-lens, selecting the layer-2 *bird* node emphasizes Eagle and Penguin, while selecting its layer-3 node emphasizes Fly. Selecting several nodes within one layer averages their Jacobians.

{% include figures/jacobian-lens.html %}

These maps are constructed examples, not measurements showing that real layers separate species and actions. What matters here is that **the same input state can be read differently depending on which downstream responses we examine**. To understand why, we need to look at the matrix between the state and the decoder.

## 2. What the Jacobian changes

The extra step in J-lens is a matrix–vector product, $h\longrightarrow Jh$. A Jacobian describes how a small change in an input hidden state changes a later hidden state. At input layer $\ell$ and position $t$, write the response at final-layer position $t+\tau$ as

$$
K(c,\ell,\tau)=\frac{\partial h_{L,t+\tau}}{\partial h_{\ell,t}}.
$$

Here $c=(x,t)$ identifies the context, and $\tau$ is the distance to the output position, or *lag*. One input can affect several later positions, so we can average their responses. Averaging over a window of $H$ lags, then over contexts, gives

$$
G_c=\frac{1}{H}\sum_{\tau=0}^{H-1}K(c,\ell,\tau),\qquad
J_H=\mathbb E_cG_c.
$$

The J-lens applies this average to the hidden state, normalizes the result, and reads it through the unembedding $W_U$:

$$
\boxed{p_J(h)=\operatorname{softmax}\!\left(W_U\operatorname{norm}(J_Hh)\right).}
$$

Unembedding turns the transformed representation into token logits; softmax turns those logits into probabilities. Since Jacobians describe local perturbation responses, $J_Hh$ is an interpretive readout, not the exact hidden state the model computes at a later layer.

**If $J_H=I$, this becomes the Logit Lens**, using the same normalization and unembedding. The graph uses a single-context average $G_S$ over selected positions, rather than the paper's context-averaged $J_H$.

### Try the matrix on its own

The next demo isolates this transformation. It has a fixed four-dimensional input $h$ and an arbitrary example matrix $J$, independent of the graph above. Select **Logit Lens** to pass the vector through identity, then **J-space** to see how the matrix changes its coordinates. The **Read by Unembedding** block marks the next step: reading that output as logits. The J-space button illustrates the matrix operation; it does not perform sparse reconstruction.

{% include figures/jacobian-matrix.html %}

We can understand the multiplication one column at a time. Writing $J_{:k}$ for the $k$th column,

$$
Jh=\sum_{k=1}^{d}h_kJ_{:k}\in\operatorname{Col}(J).
$$

Each input coordinate $h_k$ weights a column of $J$, and the weighted columns add up to the new representation. **The column space determines the range of output directions the matrix can produce.** In this demo, L2 normalization only rescales the result, so the vector sent to unembedding stays in that space. A model's learned normalization may additionally rescale or shift individual coordinates; the column-space statement applies exactly to $Jh$ itself.

But knowing which directions are possible does not tell us how strongly they are transmitted. The example matrix is full rank, so its column space is all of $\mathbb R^4$. To understand which directions it favors, we need its singular values.

## 3. Why different inputs can yield similar readouts

Singular value decomposition (SVD) writes the matrix as a sum of input–output channels:

$$
J=U\Sigma V^\top=\sum_i\sigma_i u_i v_i^\top,\qquad
Jh=\sum_i\underbrace{(v_i^\top h)}_{\text{input alignment}}\,
\underbrace{\sigma_i}_{\text{gain}}\,
\underbrace{u_i}_{\text{output direction}}.
$$

Each term has three parts. First, $v_i^\top h$ measures how much the input aligns with direction $v_i$. The singular value $\sigma_i$ sets the gain along that channel, and $u_i$ gives the direction of its output. Adding these responses reconstructs $Jh$. For the matrix in the demo,

$$
\Sigma\approx\operatorname{diag}(1.2150,\;0.9115,\;0.6818,\;0.6053).
$$

No single value dominates this particular example. Now suppose the first singular value were much larger than the others. We can separate its contribution from the remaining terms:

$$
Jh=\sigma_1(v_1^\top h)u_1+r(h),\qquad
\|r(h)\|_2\leq\sigma_2\|h\|_2.
$$

The leading term dominates when

$$
\sigma_1\lvert v_1^\top h\rvert\gg\sigma_2\lVert h\rVert_2.
$$

Different inputs can then produce outputs close to the same axis, even when their other components differ. With the same sign of $v_1^\top h$, their L2-normalized outputs approach the same direction. **A dominant response channel can make different hidden states look more alike before unembedding.**

This is one way input dependence can weaken, but it is conditional. An input nearly orthogonal to $v_1$ may be governed by other modes; reversing the sign of its leading alignment reverses the output direction. Nor does $u_1$ automatically mean Eagle or Fly. Its token interpretation comes from the unembedding. The next question is what makes a direction remain strong after the Jacobians are averaged.

## 4. Which responses survive averaging?

Imagine two output positions that respond strongly to the same input direction. If their responses point in opposite directions, averaging can cancel them. Smaller responses that consistently point the same way may survive the average more strongly. The same applies across contexts: a response that is strong in one sentence can be weakened by an opposing response in another.

The paper *A Mathematical Theory of the Jacobian Lens* describes this distinction using three factors. For a unit input direction $v$, it defines

$$
\begin{aligned}
a(v)&=\mathbb E_{c,\tau}\|K(c,\ell,\tau)v\|_2,\\
\rho_\tau(v)&=\frac{\mathbb E_c\|G_cv\|_2}{a(v)},\\
\rho_c(v)&=\frac{\|J_Hv\|_2}{\mathbb E_c\|G_cv\|_2}.
\end{aligned}
$$

| Factor | Meaning |
| --- | --- |
| Magnitude $a(v)$ | Mean response size before averaging |
| Lag coherence $\rho_\tau(v)$ | Fraction retained after averaging output positions |
| Context coherence $\rho_c(v)$ | Fraction retained after averaging contexts |

Magnitude measures the response before averaging. Each coherence factor measures the fraction retained at the next averaging step, so both lie in $[0,1]$. A zero denominator is assigned zero coherence. Multiplying the three factors cancels the intermediate denominators and gives the gain along $v$:

$$
\|J_Hv\|_2=a(v)\rho_\tau(v)\rho_c(v).
$$

This connects the averaging process to SVD. The largest singular value is the largest output norm attainable by a unit input. Substituting the factorization above gives

$$
\boxed{\sigma_1(J_H)=\max_{\|v\|_2=1}
\underbrace{a(v)}_{\text{magnitude}}\,
\underbrace{\rho_\tau(v)}_{\text{lag coherence}}\,
\underbrace{\rho_c(v)}_{\text{context coherence}}.}
$$

We maximize **the product along one direction**, not each factor separately. A maximizing direction can be chosen as the leading right singular vector $v_1$; at any right singular vector $v_i$, the product equals $\sigma_i$.

A large singular value of the averaged Jacobian therefore reflects both response strength and what remains consistent under averaging. The first demo lets us change the selected output positions and observe a different readout for the same input. It covers only one context, so it does not demonstrate context coherence. The standalone matrix also has no underlying collection of context-and-lag Jacobians from which to recover these three factors.

## 5. Choosing the Jacobians shapes the interpretation

Return to *bird* in the first demo. Changing only the selected output nodes changed what we read from its hidden state. In an analysis of a trained model, the choice of input/output layers, lag window, and contexts likewise changes which responses enter the average and which ones cancel.

The resulting token distribution should therefore be read alongside **the choices used to construct the lens**. Those choices affect magnitude, lag coherence, and context coherence—and consequently the spectrum of the averaged map. **Selecting the Jacobians introduces an interpretation bias:** the lens emphasizes responses that remain strong and consistent under that particular selection and averaging scheme.

## References

1. Ostrow, M., Qian, D., Liu, T. J. B., & Fiete, I. (2026). **[A Mathematical Theory of the Jacobian Lens](https://arxiv.org/abs/2610.31955)**. arXiv:2610.31955.
2. Anthropic. (2026). **[A global workspace in language models](https://www.anthropic.com/research/global-workspace)**. Introducing the Jacobian Lens and J-space.

<link rel="stylesheet" href="{{ '/assets/css/jacobian-lens-demo.css' | relative_url }}">
<script defer src="{{ '/assets/js/posts/jacobian-lens-demo.js' | relative_url }}"></script>
