---
layout: post
title: "Modeling JEPA Transitions with Hamiltonian Dynamics"
permalink: /blog/2026/jepa-hamiltonian-dynamics-en/
mini-title: "JEPA & Hamiltonian Dynamics"
---

## 1. JEPA: Predicting representations

Imagine watching a pendulum and predicting what it will do next. We could predict the pixels of its next image, or we could predict a representation of its state. Joint-Embedding Predictive Architecture (JEPA) takes the latter approach. In an action-conditioned world model, an encoder maps an observation $x_t$ to a latent state $z_t$, and a predictor advances that representation using the action $u_t$:

$$
z_t=\operatorname{Enc}_{\theta}(x_t),\qquad
\hat z_{t+1}=F_{\phi}(z_t,u_t).
$$

To check the prediction, we encode the actual future observation and compare the two representations. Schematically, the prediction loss is

$$
\mathcal L_{\mathrm{pred}}
=D\!\left(\hat z_{t+1},\operatorname{Enc}_{\theta}(x_{t+1})\right).
$$

The encoder determines **what information describes the state**, while the predictor determines **how that state evolves**. Both matter: a constant encoder could make the prediction loss trivially small without representing anything useful, so practical JEPA systems need additional mechanisms to avoid encoder collapse.

The demo below separates the prediction path from the target path. Press **Play prediction** to sweep through scene angles, or set the angle manually. Increase **Predictor fit** to bring the predicted representation toward the encoded future; the fit remains fixed during playback unless you adjust it. Select a block to inspect its role. This is an analytic illustration, not a trained model.

{% include figures/jepa-prediction.html %}

Now imagine feeding the predictor's output back into itself to look further ahead. Even if the encoder produces useful representations, the transition can gradually squeeze them together. A simple example is $F(z)=0.9z$: every step reduces the state magnitude, so repeated predictions give

$$
F^k(z)=0.9^kz\longrightarrow0.
$$

Distinct states then become increasingly difficult to distinguish. **Preventing encoder collapse does not ensure that the predictor preserves distinctions during a rollout.** To address this second problem, we need to examine the transition itself.

[LeHami](https://arxiv.org/abs/2610.15267), introduced by Yalovetzky, Balestriero, and LeCun (2026), builds that transition from Hamiltonian dynamics. The aim is to make certain geometric properties hold regardless of the learned parameters. To see how, we can start with the pendulum's position and momentum.

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

As the pendulum swings, energy moves between height and motion. Hamilton's equations explain why the total remains constant in the ideal continuous system. For an autonomous Hamiltonian, with no explicit time dependence,

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

Learning these scalars changes how the predictor is parameterized: **their gradients define a Hamiltonian vector field**, so the networks choose the dynamics within that structure. The numerical value of $H$ is not the prediction target; the two gradients can even be evaluated separately without computing their sum. The training signal still comes from future latent prediction errors, rather than ground-truth energy labels.

The learned $H$ therefore need not recover physical energy, and changing actions can make it time-dependent. What LeHami inherits is the structure of the transition. Preserving that structure in an actual rollout requires one more choice: how to turn the continuous equations into discrete updates.

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

Momentum advances half a step, position advances a full step using the intermediate momentum, and momentum completes its remaining half step. The momentum updates are called **kicks**, and the position update is a **drift**. These names describe the numerical splitting; they do not mean that the physical pendulum receives separate impacts. Each stage uses the result of the previous one.

This update is **symplectic**: it preserves the geometric structure of Hamiltonian phase space. It generally does not conserve the original Hamiltonian exactly at a finite step size. Exact symplecticity and exact energy conservation are different claims.

Use **Play rollout** to follow the harmonic oscillator $H=(q^2+p^2)/2$. The small patch contains nearby states that undergo the same updates. Watch its area and energy separately, then switch to **Explicit Euler** and play again. Changing the method or step size starts again from the same initial state.

{% include figures/hamiltonian-flow.html %}

### 2.4. Why does the Jacobian determinant equal one?

The patch in the demo lets us see a group of nearby states move together. To measure whether that group is being squeezed or expanded, consider a transition $z_{t+1}=F(z_t;u_t)$ with $z=(q,p)$. For a fixed action, its state Jacobian is

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

This allows the patch to stretch in one direction while narrowing in another. Individual distances can change even though the full phase-space volume remains fixed. We can also use the same Jacobian calculation to understand why the Euler trajectory in the demo behaves differently.

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

The determinant can be greater than, equal to, or less than one, depending on the two curvatures. Local area change is measured by its absolute value, $\lvert\det J_{\mathrm{Euler}}\rvert$; a negative determinant additionally reverses orientation. The oscillator illustrates expansion, but the broader issue is the absence of a general symplectic guarantee for explicit Euler.

### 2.5. How are q and p obtained from images?

So far, the demos have supplied $q$ and $p$ directly. LeHami instead starts with images: it must learn a representation that can be advanced by this structured predictor. A single-frame encoder supplies the position-like component,

$$
q_t=\operatorname{Enc}_{\theta}(x_t).
$$

A fixed Savitzky–Golay differentiation stencil then estimates a momentum-like representation from recent latent positions. It fits a low-degree polynomial to a short window of samples and differentiates that polynomial to estimate the local rate of change, reducing sensitivity to noise compared with a simple difference between adjacent samples:

$$
p_t=\operatorname{SG}(q_{t-3},\ldots,q_t)
\approx\frac{dq_t}{dt}.
$$

The pair now carries both a visual representation and information about how it is changing. Neither component is supervised as a physical coordinate, so the derivative-based $p$ should be understood as a momentum-like modeling choice, not an identified physical canonical momentum.

The Hamiltonian predictor advances this pair, and a multi-step prediction loss compares its outputs with latent targets constructed from future observations. Training the encoder and Hamiltonian together lets the representation adapt to the structured dynamics, with representation regularization complementing the prediction objective. This brings us back to the two parts of JEPA: learning what to represent and deciding how it can evolve.

## 3. Additional comments

Return to the patch moving through phase space in the rollout demo. Its preserved area is easier to interpret if we start with **intervals of possible positions and momenta, rather than a single point**. For one coordinate–momentum pair, these intervals define a rectangle:

$$
A_t=[q_{\min},q_{\max}]\times[p_{\min},p_{\max}],\qquad
\operatorname{Area}(A_t)=(q_{\max}-q_{\min})(p_{\max}-p_{\min}).
$$

Each point represents a different possible state. When the same action-conditioned transition moves all of them forward, their destinations form a new region:

$$
A_{t+1}=F_{u_t}(A_t)
=\{F(z;u_t):z\in A_t\}.
$$

That region may be curved or stretched. **We compare the area occupied by the state set at $t$ with its area at $t+1$, not the area swept out by one trajectory.** The determinant calculation tells us how to make this comparison: for a leapfrog transition,

$$
\boxed{
\operatorname{Area}(A_{t+1})
=\int_{A_t}\left|\det J_{F_{u_t}}(z)\right|\,dq\,dp
=\operatorname{Area}(A_t).
}
$$

The action $u_t$ controls where the region moves and how it deforms. Changing the action changes the map, but every leapfrog map still preserves area when that action is shared by all states and held fixed within the step. Composing such maps therefore preserves area even across a changing action sequence:

$$
A_{t+k}=\bigl(F_{u_{t+k-1}}\circ\cdots\circ F_{u_t}\bigr)(A_t),\qquad
\operatorname{Area}(A_{t+k})=\operatorname{Area}(A_t).
$$

With $d$ coordinate–momentum pairs, this area becomes phase-space volume, $\operatorname{Vol}(A)=\int_A d^dq\,d^dp$. Its preservation does not require energy to stay constant: the action can do work while the state region keeps the same volume. Even without changing actions, finite-step leapfrog preserves symplectic geometry without generally preserving the original $H$ exactly. A state-dependent policy adds another dependence to the transition, so its closed-loop map is not automatically covered by the shared-action argument.

For JEPA, the useful consequence is that this state region cannot be uniformly squeezed into a smaller volume during rollout. **The restriction comes from the form of the predictor, rather than a penalty that must be learned from data.** It still allows some directions to contract while others expand, which can make particular distinctions harder to read. Preserved volume therefore does not, by itself, establish semantic preservation, accurate prediction, or a useful encoder.

The same distinction applies to the learned Hamiltonian. Its role is to generate structured latent transitions; neither its value nor the latent coordinates are supervised to recover physical energy and coordinates. Their usefulness must be checked through prediction and control. The paper's pendulum experiments provide evidence in that setting, with task-dependent results rather than a guarantee of better planning everywhere.

LeHami thus makes a specific choice about JEPA's transition: learn the dynamics inside a class of maps that already excludes certain collapse modes. The geometry tells us what cannot happen to a region of states. The learning objective and evaluation still have to establish whether those states describe the world well.

## 4. Putting the flow together

The overview below connects the observations, action sequence, and phase-space trajectory in one view. Press **Play flow** to advance the state, then retrace it backward using the reversed action sequence. You can pause, select a frame, or change **Action strength** to start a different rollout. The two panels track prediction at finer time steps and numerical time reversal. They use an analytic driven pendulum to illustrate the geometry, rather than reproduce a trained LeHami model.

{% include figures/lehami-overview.html %}

## References

1. Yalovetzky, R., Balestriero, R., & LeCun, Y. (2026). **[LeHami: Symplectic Latent Dynamics for World Models](https://arxiv.org/abs/2610.15267)**. arXiv:2610.15267.

<link rel="stylesheet" href="{{ '/assets/css/jepa-hamiltonian-demo.css' | relative_url }}">
<script defer src="{{ '/assets/js/posts/jepa-hamiltonian-demo.js' | relative_url }}"></script>
