---
layout: distill-reading
language: English
category: Architecture
media: Study
bibliography: all.bib
giscus_comments: false
disqus_comments: false
date: 2025-12-08
featured: true
title: 'RWKV (Receptance, Weight, Key, Value)'
description: 'Compute key scores, filter by activation magnitude, and retrieve the corresponding value components.'
_styles: >
    .table {
        padding-top:200px;
        margin-bottom: 2.5rem;
        border-bottom: 2px;
    }
    .p {
        font-size:20px;
    }
    .styled-image {
        border-radius: 15px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        margin: 20px auto;
        transition: transform 0.3s ease;
        display: block;
    }
    .small-table {
        font-size: 0.85em;
    }
    .small-table table {
        font-size: 0.85em;
    }
    
---


>  RWKV history Wiki [[good post](https://wiki.rwkv.com/basic/architecture.html?utm_source=chatgpt.com)]


The RWKV4 model architecture (RWKV: Reinventing RNNs for the Transformer Era [[arxiv](https://arxiv.org/abs/2305.13048)]) is defined by four fundamental components that are intrinsic to both the time-mixing and channel-mixing blocks:

- **R (Receptance):** A gating vector that determines how much new information should be incorporated, acting as the receiver of past contextual signals.
- **W (Weight Decay):** A trainable positional decay vector that controls how strongly past states influence the current timestep.
- **K (Key):** A feature vector analogous to the key representation in conventional attention mechanisms, used to modulate relevance.
- **V (Value):** A value vector similar in role to the value representation in standard attention, carrying the content to be written into the state.

These core elements interact multiplicatively at each timestep, shaping how the model integrates past information and produces new representations.

## History of RWKV

<div class="small-table" markdown="1">

| Version    | Year     | Notes / Contribution                          |
|----------- |----------|------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------|
| **RWKV-1** | **2021** | First prototype; RNN + Transformer hybrid idea |
| **RWKV-2** | **2021** | Added time-mix formulation; more stable        |
| **RWKV-3** | **2022** |  Full attention-free RNN; major stability gains |
| **RWKV-4** | **2023** | widely adopted version; efficient large-scale training <br> RWKV: Reinventing RNNs for the Transformer Era <br> EMNLP 2023 |
| **RWKV-5** | **2023** |  Improved scaling, speed, and stability         |
| **RWKV-6** | **2024** | Global mixing, world-level context modeling    |
| **RWKV-7** | **2025** | State-space + mixer hybrid; new theoretical formulation <br> *RWKV-7 "Goose" with Expressive Dynamic State Evolution* |

</div>

### Token Mixing
$$
Y_t = \sum_{s=1}^{T} W^{(\text{token})}_{t,s}\, X_s
$$

- Here, $W^{(\text{token})} \in \mathbb{R}^{T \times T}$ is the **token-interaction weight matrix**, where each entry $W^{(\text{token})}_{t,s}$ specifies *how much token $t$ attends to or mixes information from token $s$*.

### Channel Mixing
$$
Y_{t,c} = \sum_{k=1}^{C} W^{(\text{channel})}_{c,k}\, X_{t,k}
$$

- Here, $W^{(\text{channel})} \in \mathbb{R}^{C \times C}$ is the **feature-interaction weight matrix**, where each entry   $W^{(\text{channel})}_{c,k}$ expresses *how channel $c$ is formed as a combination of input channels $k$*.


- **RWKV-1 (2021):**  
  Introduced the **Token-Mixing module** and **Channel-Mixing module** as two parallel MLP-based mixers. This established the core RWKV idea: mix information across time (tokens) and across channels without attention.

- **RWKV-2 (2021):**  
  Added the **Time-Mix module**, which blends the previous token state and current token input using learnable mixing coefficients. This replaced the earlier simpler mixing rule and made the recurrence stable and smooth.

- **RWKV-3 (2022):**  
  Introduced the **full Attention-Free Recurrent Block**, integrating time-mix and channel-mix into a cleaner RNN-style layer. The key addition was a stabilized **weighted recurrence module** that replaced attention entirely.

- **RWKV-4 (2023):**  
  Refined the internal block by adding **better normalization and gating modules**. While conceptually similar to RWKV-3, RWKV-4 introduced more efficient implementations of time-mix, channel-mix, and recurrence, enabling large-scale training. No major new module, but substantial restructuring of existing ones.

- **RWKV-5 (2023):**  
  Added enhanced **state refinement modules** and **improved mixing functions**, including more stable decay/forget gates inside the recurrence. The module-level change focused on deeper networks: stronger gating and smoother recurrence updates.

- **RWKV-6 (2024):**  
  Introduced the **Global-Mixing module**, allowing updates that incorporate global-context signals beyond local recurrence. This module acts like a lightweight global state that every token can read/write, pushing RWKV toward world-level context modeling.

- **RWKV-7 “Goose” (2025):**  
  Added a new **State-Space Evolution module**, combining mixer-style updates with SSM-style dynamic transitions. This module explicitly models **expressive dynamic state evolution**, merging recurrence, mixing, and continuous-time state updates into a unified formulation.


---




## 1. AFT’s Original Attention Formulation

AFT (Attention-Free Transformer) defines attention using a pairwise positional bias matrix
$W = { w_{t,i} } \in \mathbb{R}^{T \times T}$, where each $w_{t,i}$ is a learnable scalar.

The forward attention computation at time step $t$ is:

$$
\text{Attn}^+(W, K, V)_t =
\frac{
\sum_{i=1}^{t} e^{w_{t,i} + k_i} \odot v_i
}{
\sum_{i=1}^{t} e^{w_{t,i} + k_i}
}.
$$

-	$k_i$ and $v_i$ denote the key and value vectors at position $i$.
-	$w_{t,i}$ applies a learned bias between positions $t$ and $i$.
-	Because $W$ is a full $T \times T$ matrix, AFT retains pairwise interactions across all positions, which prevents expressing the attention as a simple recurrence.


## 2. RWKV’s Simplification of AFT

RWKV adopts the same basic structure as AFT but removes the full pairwise parameterization.
Instead of learning every $w_{t,i}$ independently, RWKV introduces a channel-wise exponential decay:

$$
w_{t,i} = - (t - i) w,
$$

where
-	$w \in \mathbb{R}_{\ge 0}^d$ is a non-negative vector of decay rates,
-	$d$ is the hidden dimension (i.e., number of channels).


Key implications
-	$w_{t,i}$ now depends only on the relative distance $(t-i)$ and the per-channel decay $w[c]$.
- Since $w \ge 0$, we have $e^{w_{t,i}} \le 1$, ensuring monotonic backward decay.
-	The exponential kernel

$$
e^{w_{t,i}}
= e^{-(t-i)w}
$$

becomes recursively accumulable, enabling RWKV to convert AFT-like attention into an RNN update.
This simplification eliminates the $T \times T$ parameter matrix and allows a linear-time, recurrent implementation of attention-like behavior.

---

<img src="https://d2acbkrrljl37x.cloudfront.net/bumjini-blog/study_post/RWKV.webp" width="100%" height="auto" class="styled-image"/>

# RWKV Block: Mathematical Formulation (Revised)

An RWKV block consists of two sequential components:

1. **Time Mixing**
2. **Channel Mixing**

Both components use LayerNorm and residual connections.


## 1. Time Mixing

Given the current input $x_t$ and previous input $x_{t-1}$, RWKV applies
mixing coefficients $\mu_k, \mu_v, \mu_r$:

$$
\begin{aligned}
x_t^{(k)} &= \mu_k x_t + (1-\mu_k)x_{t-1}, \\
x_t^{(v)} &= \mu_v x_t + (1-\mu_v)x_{t-1}, \\
x_t^{(r)} &= \mu_r x_t + (1-\mu_r)x_{t-1}.
\end{aligned}
$$

Linear projections:

$$
K_t = W_k x_t^{(k)}, \qquad
V_t = W_v x_t^{(v)}, \qquad
R_t = \sigma(W_r x_t^{(r)}).
$$


## 1.1 Exponential Time Decay

RWKV uses a non-negative channel-wise decay vector  
$w \in \mathbb{R}_{\ge 0}^d$ and defines the decay factor:

$$
\lambda = e^{-w}.
$$


## 1.2 WKV Operator (Exact Form)

At time $t$, the WKV operator computes:

$$
\mathrm{WKV}_t =
\frac{
\displaystyle \sum_{i=1}^{t-1} e^{-(t-1-i)w + K_i} \odot V_i
\;+\;
e^{u + K_t}\, \odot\, V_t
}{
\displaystyle \sum_{i=1}^{t-1} e^{-(t-1-i)w + K_i}
\;+\;
e^{u + K_t}
},
$$

where $u$ is a learnable scalar per channel controlling the weighting of the
current token.

Time-mixing output:

$$
y_t^{(\text{time})} = R_t \odot \mathrm{WKV}_t.
$$

## 2. Channel Mixing

Apply LayerNorm:

$$
z_t = \mathrm{LayerNorm}(x_t').
$$

Compute channel-mixing gates and projections:

$$
r'_t = \sigma(W_{r'} z_t), \qquad
k'_t = W_{k'} z_t, \qquad
v'_t = W_{v'} z_t.
$$

Feedforward-style transformation:

$$
y_t^{(\text{chan})}
= r'_t \odot \phi(k'_t) \odot v'_t,
$$

where $\phi$ is an activation such as $\mathrm{ReLU}$ or $\mathrm{SiLU}$.


----

# RWKV-7 Components (Miras Framework Interpretation)

According to the **Miras** framework, RWKV-7 can be interpreted through four major component axes:  
**State Type**, **Attentional Bias**, **Retention Gate**, and **Update Rule**.  
RWKV-7 is defined by the following matrix-state recurrence:

$$
\mathbf{M}_t
= \mathrm{diag}(\alpha_t)\,(I - \beta_t k_t k_t^\top)\,\mathbf{M}_{t-1}
\;+\;
\beta_t\, v_t k_t^\top .
$$

This update rule expresses RWKV-7 as a matrix-valued memory system performing L2-style optimization at each timestep.

## Component Table

| **Component Category** | **RWKV-7 Specification** | **Explanation** |
|------------------------|---------------------------|------------------|
| **State Type** | Matrix | Memory state is a full matrix $ \mathbf{M}_t \in \mathbb{R}^{d \times d} $. |
| **Attentional Bias** | L2 | Derived from minimizing the L2 objective $ \| \mathbf{M} k_t - v_t \|_2^2 $. |
| **Retention Gate** | L2 | Projection-based forgetting via $ (I - \beta_t k_t k_t^\top) $. |
| **Update Rule** | GD | State update equals a one-step gradient descent on the L2 regression objective. |
| **Decay Term** | Channel-wise $ \alpha_t $ | The factor $ \mathrm{diag}(\alpha_t) $ controls per-channel memory retention. |
| **Projection Forgetting** | $ I - \beta_t k_t k_t^\top $ | Removes memory aligned with the new key direction $ k_t $. |
| **Write Operation** | $ \beta_t v_t k_t^\top $ | A rank-1 update storing current key–value interaction. |
| **Representation Power** | High | Matrix dynamics approximate attention’s KV outer-product accumulation. |
| **Gating Inputs** | $ \alpha_t, \beta_t, k_t, v_t $ | Inputs controlling decay, forgetting strength, and new memory content. |
| **Overall Interpretation** | Online L2 Memory Optimizer | RWKV-7 updates memory by fitting $ \mathbf{M} k_t \approx v_t $ at each step. |

## Summary

RWKV-7 can be viewed as a **matrix-state RNN** that performs  
1) channel-wise decay,  
2) projection-based forgetting, and  
3) rank-1 writing,  
all governed by an L2 regression interpretation.  
This yields an attention-like but fully recurrent memory system within the Miras framework.