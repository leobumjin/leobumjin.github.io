---
layout: post
title: "Modeling JEPA Transitions with Hamiltonian Dynamics"
permalink: /blog/2026/jepa-hamiltonian-dynamics-en/
mini-title: "JEPA & Hamiltonian Dynamics"
---

## 1. JEPA: Predicting representations

Joint-Embedding Predictive Architecture (JEPA) learns to predict representations rather than reconstruct observations. In an action-conditioned world model, an encoder maps an observation $x_t$ to a latent state $z_t$, and a predictor estimates the representation of a future observation:

$$
z_t=\operatorname{Enc}_{\theta}(x_t),\qquad
\hat z_{t+1}=F_{\phi}(z_t,u_t).
$$

The predicted representation is compared with a target obtained from the actual future observation. Schematically,

$$
\mathcal L_{\mathrm{pred}}
=D\!\left(\hat z_{t+1},\operatorname{Enc}_{\theta}(x_{t+1})\right).
$$

This separates two questions: **what information should the encoder represent, and how should that representation evolve over time?** The prediction loss alone does not prevent a constant encoder from trivially satisfying the objective; practical JEPA systems need additional mechanisms to avoid encoder collapse.

The demo below separates the prediction path from the target path. Press **Play prediction** to sweep through scene angles, or set the angle manually. Increase **Predictor fit** to bring the predicted representation toward the encoded future; the fit remains fixed during playback unless you adjust it. Select a block to inspect its role. This is an analytic illustration, not a trained model.

{% include figures/jepa-prediction.html %}

There is also a different problem at prediction time. An unconstrained predictor can achieve useful short-term predictions while progressively contracting the latent space during repeated rollouts. For example, $F(z)=0.9z$ reduces the magnitude of every state at each step:

$$
F^k(z)=0.9^kz\longrightarrow0.
$$

Distinct states then become increasingly difficult to distinguish. Preventing the encoder from collapsing during training does not, by itself, prevent this contraction during inference.

[LeHami](https://arxiv.org/abs/2610.15267), introduced by Yalovetzky, Balestriero, and LeCun (2026), addresses this problem by introducing Hamiltonian dynamics into a JEPA-style world model. It constrains the transition itself, so certain geometric properties hold regardless of the learned parameters.

## 2. Hamiltonian dynamics: Learning under conservation

### 2.1. What is a Hamiltonian?

A Hamiltonian is a scalar function that generates the time evolution of a dynamical system. In a familiar mechanical system, it represents total energy:

$$
H(q,p)=K(p)+V(q),
$$

where $q$ is position, $p$ is momentum, $K$ is kinetic energy, and $V$ is potential energy. For a particle of constant mass $m$, momentum is $p=mv$, and Newton's equations give

$$
\frac{dq}{dt}=\frac{p}{m},\qquad
\frac{dp}{dt}=F.
$$

For a conservative force, $F=-\partial V/\partial q$. Choosing

$$
H(q,p)=\frac{p^2}{2m}+V(q)
$$

lets us express both updates through derivatives of the same scalar:

$$
\boxed{
\frac{dq}{dt}=\frac{\partial H}{\partial p},\qquad
\frac{dp}{dt}=-\frac{\partial H}{\partial q}.
}
$$

These are Hamilton's equations. The negative sign in the second equation reflects the direction of conservative force: toward decreasing potential energy. The opposite signs also give the dynamics their characteristic geometric structure.

For a pendulum, choose the angle as the generalized coordinate $q=\theta$. Its conjugate momentum is angular momentum, $p=m\ell^2\dot q$, rather than linear momentum $mv$. With normalized units $m=\ell=g=1$,

$$
H(q,p)=\frac{p^2}{2}+1-\cos q,\qquad
\dot q=p,\qquad \dot p=-\sin q.
$$

Set the initial angle and momentum below, then play the motion. **The same position can lead to different futures depending on momentum.** At a turning point $p$ is zero; near the bottom its magnitude is largest as potential energy becomes kinetic energy.

{% include figures/pendulum-state.html %}

For an autonomous Hamiltonian, with no explicit time dependence,

$$
\begin{aligned}
\frac{dH}{dt}
&=\frac{\partial H}{\partial q}\frac{dq}{dt}
 +\frac{\partial H}{\partial p}\frac{dp}{dt}\\
&=\frac{\partial H}{\partial q}\frac{\partial H}{\partial p}
 -\frac{\partial H}{\partial p}\frac{\partial H}{\partial q}
=0.
\end{aligned}
$$

Thus, $H$ is conserved along the continuous-time trajectory. This follows from Hamilton's equations, not merely from writing $H$ as a sum. A general Hamiltonian need not be separable into $K(p)$ and $V(q)$.

### 2.2. Learning a Hamiltonian without energy supervision

LeHami does not assume access to a system's true physical energy. Instead, neural networks learn kinetic-like and potential-like scalar functions. For clarity, write their combination as

$$
H_{\phi}(q,p;u)=K_{\phi}(p)+V_{\phi}(q,u),
$$

where $u$ is an external action, such as a torque applied to a pendulum. The paper additionally learns a diagonal momentum rescaling inside the kinetic term; here it is absorbed into the notation $K_{\phi}$.

The latent dynamics follow

$$
\dot q=\nabla_pK_{\phi}(p),\qquad
\dot p=-\nabla_qV_{\phi}(q,u).
$$

Why learn these scalar functions rather than predict the next state directly? **Their gradients define a Hamiltonian vector field.** The networks determine the dynamics, while the equations restrict the transformations those dynamics can produce.

The numerical value of $H$ is not the prediction target. The two gradients can even be evaluated separately without explicitly computing their sum. What matters is that they generate updates with a common Hamiltonian structure.

Training uses future latent prediction errors rather than ground-truth energy labels. Consequently, the learned $H$ need not recover physical energy. With changing actions, it need not remain constant either: action conditioning can introduce explicit time dependence. The geometric property of the transition survives this distinction.

### 2.3. From Hamilton's equations to leapfrog

Hamilton's equations describe continuous motion, but a world model must calculate discrete transitions. Updating $q$ and $p$ simultaneously with ordinary explicit Euler integration generally does not preserve Hamiltonian geometry.

LeHami instead uses leapfrog integration. For a step size $h$, with action $u_t$ held fixed throughout the step, the update has three stages:

$$
\begin{aligned}
p_{t+1/2}
&=p_t-\frac{h}{2}\nabla_qV_{\phi}(q_t,u_t),\\
q_{t+1}
&=q_t+h\nabla_pK_{\phi}(p_{t+1/2}),\\
p_{t+1}
&=p_{t+1/2}-\frac{h}{2}\nabla_qV_{\phi}(q_{t+1},u_t).
\end{aligned}
$$

Momentum advances half a step, position advances a full step using the intermediate momentum, and momentum completes its remaining half step. Each stage uses the result of the previous one.

This update is **symplectic**: it preserves the geometric structure of Hamiltonian phase space. It generally does not conserve the original Hamiltonian exactly at a finite step size. Exact symplecticity and exact energy conservation are different claims.

Use **Play rollout** to follow the harmonic oscillator $H=(q^2+p^2)/2$. The small patch contains nearby states that undergo the same updates. Watch its area and energy separately, then switch to **Explicit Euler** and play again. Changing the method or step size starts again from the same initial state.

{% include figures/hamiltonian-flow.html %}

### 2.4. Why does the Jacobian determinant equal one?

Consider a transition $z_{t+1}=F(z_t;u_t)$ with $z=(q,p)$. For a fixed action, its state Jacobian is

$$
J_F=\frac{\partial F}{\partial z}.
$$

The absolute determinant measures the local change in phase-space volume:

| Jacobian determinant | Local effect |
| --- | --- |
| $\lvert\det J_F\rvert<1$ | Contraction |
| $\lvert\det J_F\rvert=1$ | Volume preservation |
| $\lvert\det J_F\rvert>1$ | Expansion |

For the first momentum update,

$$
q'=q,\qquad p'=p-\frac{h}{2}\nabla_qV_{\phi}(q,u),
$$

the Jacobian has a block triangular form:

$$
J_{\mathrm{kick}}=
\begin{bmatrix}
I&0\\
-\frac{h}{2}\nabla_q^2V_{\phi}(q,u)&I
\end{bmatrix}.
$$

Its determinant is the product of the diagonal-block determinants, so $\det J_{\mathrm{kick}}=1$. The position update has the same property:

$$
J_{\mathrm{drift}}=
\begin{bmatrix}
I&h\nabla_p^2K_{\phi}(p)\\
0&I
\end{bmatrix},\qquad
\det J_{\mathrm{drift}}=1.
$$

The final momentum update is another kick. By the chain rule, the Jacobian of their composition is the product of the three stage Jacobians, evaluated at their respective intermediate states. Therefore,

$$
\det J_F=1\times1\times1=1.
$$

Repeated steps preserve this property. **Volume preservation is built into the transition, rather than learned through an additional penalty.** In exact arithmetic, it holds for any learned parameters and any prescribed action sequence held fixed when differentiating with respect to the initial state. A state-dependent feedback policy introduces an additional dependence on $z$; its closed-loop map is not automatically covered by this argument.

The stronger geometric statement is

$$
J_F^\top\Omega J_F=\Omega,\qquad
\Omega=
\begin{bmatrix}
0&I\\
-I&0
\end{bmatrix}.
$$

Each leapfrog stage satisfies this symplectic condition when the scalar functions are sufficiently smooth. Volume preservation follows; determinant one alone would not establish symplecticity in higher dimensions.

Nor does volume preservation mean every distance remains constant. Some directions can expand while others contract. The guarantee concerns the full phase space, not each coordinate or the position-like representation alone.

#### What changes with explicit Euler?

For the harmonic oscillator in the demo, $H(q,p)=(q^2+p^2)/2$, explicit Euler updates both coordinates using the old state:

$$
q'=q+hp,\qquad p'=p-hq.
$$

Its Jacobian is

$$
J_{\mathrm{Euler}}=
\begin{bmatrix}
1&h\\
-h&1
\end{bmatrix},\qquad
\det J_{\mathrm{Euler}}=1+h^2>1\quad(h\ne0).
$$

Thus, **explicit Euler expands phase-space area by a factor of $1+h^2$ per step in this oscillator**. After $N$ steps of the same size, the area is multiplied by $(1+h^2)^N$. This explains the outward-growing trajectory in the demo, in contrast to leapfrog's area-preserving updates.

Expansion is not universal. For one scalar coordinate–momentum pair with a separable Hamiltonian $H(q,p)=K(p)+V(q)$, explicit Euler gives

$$
J_{\mathrm{Euler}}=
\begin{bmatrix}
1&hK''(p)\\
-hV''(q)&1
\end{bmatrix},\qquad
\det J_{\mathrm{Euler}}=1+h^2K''(p)V''(q).
$$

The determinant can be greater than, equal to, or less than one, depending on the two curvatures. Local area change is measured by its absolute value, $\lvert\det J_{\mathrm{Euler}}\rvert$; a negative determinant additionally reverses orientation. The general distinction is that explicit Euler does not preserve symplectic structure in general, while the leapfrog construction does.

### 2.5. How are q and p obtained from images?

In mechanics, $q$ and $p$ are physical position and canonical momentum. LeHami begins with images, so it must construct a latent pair instead.

The encoder extracts a position-like representation. For a single-frame encoder,

$$
q_t=\operatorname{Enc}_{\theta}(x_t).
$$

A fixed Savitzky–Golay differentiation stencil then estimates a momentum-like representation from recent latent positions. It fits a low-degree polynomial to a short window of samples and differentiates that polynomial to estimate the local rate of change, reducing sensitivity to noise compared with a simple difference between adjacent samples:

$$
p_t=\operatorname{SG}(q_{t-3},\ldots,q_t)
\approx\frac{dq_t}{dt}.
$$

Thus, $q$ comes from visual observations, while $p$ describes temporal changes in their learned representation. Neither is supervised as a physical coordinate. In particular, defining $p$ through a temporal derivative does not establish that it is the true physical canonical momentum; it is a modeling choice for the latent state.

The Hamiltonian predictor advances this pair, and a multi-step prediction loss compares its outputs with latent targets constructed from future observations. The encoder and Hamiltonian are trained together, with representation regularization complementing the prediction objective.

JEPA supplies the representation-learning objective. Hamiltonian mechanics constrains how the resulting state evolves.

## 3. Additional comments

The central distinction is between **encouraging a property through training and enforcing it through the form of the model**. An unconstrained predictor may learn useful geometry. A symplectic predictor must preserve the specified geometry, even before it has learned accurate dynamics.

Three limits help clarify what this buys us.

First, energy conservation and phase-space volume preservation are different. **Define a region using intervals of possible positions and momenta, rather than following a single point.** For one coordinate–momentum pair, an initial rectangle can be written as

$$
A_t=[q_{\min},q_{\max}]\times[p_{\min},p_{\max}],\qquad
\operatorname{Area}(A_t)=(q_{\max}-q_{\min})(p_{\max}-p_{\min}).
$$

Apply the same action-conditioned transition to every point in this region:

$$
A_{t+1}=F_{u_t}(A_t)
=\{F(z;u_t):z\in A_t\}.
$$

The resulting region need not remain rectangular. **The quantity being compared is the area occupied by the state set at $t$ and at $t+1$, not the area swept out by one trajectory.** For a leapfrog transition,

$$
\boxed{
\operatorname{Area}(A_{t+1})
=\int_{A_t}\left|\det J_{F_{u_t}}(z)\right|\,dq\,dp
=\operatorname{Area}(A_t).
}
$$

Changing $u_t$ changes where the region moves and how it deforms, but its area stays the same when the action is prescribed identically for every state and held fixed within each step. Across a changing action sequence,

$$
A_{t+k}=F_{u_{t+k-1}}\circ\cdots\circ F_{u_t}(A_t),\qquad
\operatorname{Area}(A_{t+k})=\operatorname{Area}(A_t).
$$

With $d$ coordinate–momentum pairs, area generalizes to phase-space volume, $\operatorname{Vol}(A)=\int_A d^dq\,d^dp$. The action can nevertheless change the energy. An autonomous continuous Hamiltonian conserves $H$; leapfrog preserves symplectic geometry without generally preserving that same $H$ exactly. State-dependent feedback actions are not automatically covered by the volume guarantee.

Second, geometric preservation does not guarantee semantic preservation. Stretching one direction while compressing another can preserve total volume while making some distinctions harder to read. Symplecticity also does not bound prediction error or prevent the encoder itself from learning an uninformative representation.

Third, a learned Hamiltonian is not necessarily recovered physical energy. The latent coordinates and their temporal derivatives are learned or constructed without physical-coordinate supervision. Their usefulness must still be evaluated empirically.

The paper's pendulum experiments illustrate both the promise and the limits: a geometric guarantee can coexist with task-dependent prediction and planning performance. It should not be read as evidence that all useful latent dynamics must be Hamiltonian.

The broader question is which mathematical properties we want a learned representation to preserve as it evolves. LeHami offers one answer: define the transition through operations whose geometry already excludes certain failure modes, then learn the dynamics within that structure.

## 4. Putting the flow together

The overview below connects the observations, action sequence, and phase-space trajectory in one view. Press **Play flow** to advance the state, then retrace it backward using the reversed action sequence. You can pause, select a frame, or change **Action strength** to start a different rollout. The two panels track prediction at finer time steps and numerical time reversal. They use an analytic driven pendulum to illustrate the geometry, rather than reproduce a trained LeHami model.

{% include figures/lehami-overview.html %}

## References

1. Yalovetzky, R., Balestriero, R., & LeCun, Y. (2026). **[LeHami: Symplectic Latent Dynamics for World Models](https://arxiv.org/abs/2610.15267)**. arXiv:2610.15267.

<link rel="stylesheet" href="{{ '/assets/css/jepa-hamiltonian-demo.css' | relative_url }}">
<script defer src="{{ '/assets/js/posts/jepa-hamiltonian-demo.js' | relative_url }}"></script>
