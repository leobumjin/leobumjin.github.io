---
layout: post
title: "Rank-One Matrix Decomposition: Covariance Matrix Perspective"
permalink: /blog/2026/rank-one-covariance-en/
mini-title: "Rank One & Covariance"
---

A covariance matrix can be assembled from one rank-one matrix per sample. The same matrix can then be decomposed into orthogonal rank-one components, ordered by how much variance they explain. These are two descriptions of the same spread: **one organized by observations, the other by principal directions**.

## From centered samples to rank-one matrices

For samples $x_i\in\mathbb R^2$, let $\mu$ be the sample mean and define $u_i=x_i-\mu$. Each vector starts at the mean and points toward a sample. The sample covariance is

$$
\mu=\frac{1}{n}\sum_{i=1}^n x_i,\qquad
C=\frac{1}{n-1}\sum_{i=1}^n u_i u_i^\top.
$$

The outer product $u_i u_i^\top$ is a $2\times2$ matrix, not a scalar. For a nonzero sample displacement, it has rank one: its only nonzero eigenvalue is $\|u_i\|^2$, in the direction $u_i/\|u_i\|$. If $u_i=0$, the matrix has rank zero.

$$
 u_i u_i^\top=
 \begin{bmatrix}
 u_{ix}^2 & u_{ix}u_{iy}\\
 u_{iy}u_{ix} & u_{iy}^2
 \end{bmatrix}.
$$

Each sample contributes squared displacement along its own axis. Summing these contributions captures both coordinate variances and cross-coordinate covariances. We use $1/(n-1)$ for sample covariance; $1/n$ gives the empirical second central moment instead. Without centering, the sum describes a second moment about the origin rather than covariance about the mean.

## From a point cloud to two principal axes

The left panel has ten synthetic samples. Click one of the numbered points (1–3), or its term below, to remove or restore it. Samples 4–10 stay included. The right panel updates the two thick principal axes for the remaining samples.

<figure class="covariance-demo">
{% include figures/covariance-2d.html %}
<figcaption>Gray terms are excluded; PCA updates with the remaining samples.</figcaption>
</figure>

## Add—and remove—one contribution at a time

The equation above explicitly adds all ten rank-one matrices. A gray term is omitted from the numerator. If $S$ is the set of included samples and $m=\lvert S\rvert$, the calculation is

$$
\mu_S=\frac{1}{m}\sum_{i\in S}x_i,\qquad
u_i(S)=x_i-\mu_S,\qquad
C_S=\frac{1}{m-1}\sum_{i\in S}u_i(S)u_i(S)^\top.
$$

Removing a sample does more than switch off its term: **the mean moves, so every remaining outer product changes too**, along with the denominator. The symbolic terms always refer to vectors centered at the current mean. Gray terms do not enter the sum.

Try removing samples 1, 2, and 3 in different combinations. Watch how the principal axes turn and their lengths change. Seven samples remain fixed, so covariance stays defined. Only the ten coordinates are stored; the current mean, covariance, and axes are computed on each click.

The point of the summation is literal: **covariance accumulates the outer-product contribution of every included centered sample**. PCA reorganizes that aggregate into orthogonal rank-one components.

## From the sum to principal directions

The sample directions are generally neither orthogonal nor unique descriptions of the covariance. Since $C$ is symmetric and positive semidefinite, it admits an orthonormal eigenbasis:

$$
C=Q\Lambda Q^\top
 =\sum_{j=1}^{2}\lambda_j q_j q_j^\top,
\qquad \lambda_1\geq\lambda_2\geq0.
$$

Here $q_j$ is a unit principal direction and $\lambda_j$ is the sample variance along it. This is also an SVD of $C$: its singular values are the nonnegative eigenvalues, and its left and right singular vectors can be chosen as the same $Q$.

The two sums therefore agree:

$$
\boxed{\frac{1}{n-1}\sum_{i=1}^n u_i u_i^\top
=\sum_{j=1}^{2}\lambda_j q_j q_j^\top.}
$$

The left side has one rank-one contribution per nonzero sample displacement. The right side has at most two nonzero rank-one components, each associated with an orthogonal axis. SVD does not assign a principal axis to each sample; every principal component summarizes the whole cloud. The covariance also discards some information: $u_i$ and $-u_i$ have identical outer products, so a contribution describes an **axis of spread**, not a signed direction of influence.

## What does “explains the most” mean?

For any unit direction $a$, the sample variance of the projected data is

$$
a^\top C a=\frac{1}{n-1}\sum_i(a^\top u_i)^2.
$$

The first principal direction maximizes this quantity. The second maximizes the remaining variance subject to orthogonality to the first and completes the two-dimensional basis. The explained-variance ratio is

$$
\mathrm{EVR}_j=\frac{\lambda_j}{\operatorname{tr}(C)}
=\frac{\lambda_j}{\lambda_1+\lambda_2}.
$$

“Explanation” here means variance captured under this linear projection. It does not mean causal explanation, semantic importance, or predictive usefulness. Feature units matter: rescaling one coordinate changes the covariance and potentially its leading axes.

With only $k$ components, the approximation is

$$
C_k=\sum_{j=1}^{k}\lambda_j q_j q_j^\top,
\qquad
\widehat x_i=\mu+\sum_{j=1}^{k}q_jq_j^\top(x_i-\mu).
$$

In two dimensions, keeping only $q_1$ projects the cloud onto a line and discards the variance $\lambda_2$. Keeping both components recovers the full centered data. The illustration shows both axes together; their lengths use standard deviations, while their rank-one covariance weights are $\lambda_j$.

## SVD of the data versus SVD of the covariance

Put the centered vectors in the **columns** of $X_c=[u_1\;u_2\;\cdots\;u_n]\in\mathbb R^{2\times n}$. Its thin SVD gives

$$
X_c=U\Sigma V^\top,\qquad
C=\frac{X_cX_c^\top}{n-1}
=U\frac{\Sigma^2}{n-1}U^\top.
$$

Thus $q_j=U_{:j}$ and $\lambda_j=\sigma_j(X_c)^2/(n-1)$. The singular values of the **data matrix** are not the variances themselves. By contrast, the singular values of the **covariance matrix** equal its eigenvalues. If samples are stored as rows, the feature-space axes appear in the right singular vectors instead.

Repeated eigenvalues allow different orthonormal axes within the same eigenspace, and any principal vector can change sign without changing its outer product. The invariant object is the covariance and its relevant subspaces, rather than one uniquely oriented set of arrows.

The useful perspective is the change in organization: individual observations build the matrix through rank-one contributions; principal directions express that same matrix through orthogonal rank-one components. The first view asks **what each sample contributes**. The second asks **which axes account for the aggregate variation**.

## Sources

- [Principal Components Analysis, Penn State STAT 505](https://online.stat.psu.edu/stat505/Lesson11) — spectral decomposition of covariance and explained variance.
- [Principal Component Analysis, University of Illinois CS 357](https://cs357.cs.illinois.edu/textbook/notes/pca.html) — the connection between centered data, SVD, and principal components.

<link rel="stylesheet" href="{{ '/assets/css/covariance-demo.css' | relative_url }}">

<script defer src="{{ '/assets/js/posts/covariance-demo.js' | relative_url }}"></script>
