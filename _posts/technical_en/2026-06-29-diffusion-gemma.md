---
layout: post
title: What Makes DiffusionGemma Different?
permalink: /blog/2026/diffusion-gemma-en/
mini-title: DiffusionGemma
---

The first confusing thing about DiffusionGemma is its name. It is called diffusion, but it does not remove continuous pixel noise in the way image diffusion models do. It also does not generate text like a standard LLM, fixing one token at a time from left to right. The core idea is that DiffusionGemma **creates a fixed-length token canvas and repeatedly denoises the entire canvas until the answer becomes more coherent**.

A typical autoregressive language model generates the next token one by one. Tokens that have already been generated are fixed, and later tokens are conditioned on the earlier ones. DiffusionGemma works differently. It first creates a canvas of a certain length, starts from a noisy token state, and revises that canvas through multiple denoising steps. As a result, a single forward pass does not focus on only one next token. It computes logits for all positions in the canvas at once.

This is why DiffusionGemma should not be understood simply as a "faster Gemma." Even if it uses a Transformer-like backbone, its inference-time computation graph is different. The prompt is prefilling once and stored as a KV cache, while the generation canvas repeatedly changes while attending to that cache. In other words, generation is less like "writing the next token" and more like **revising a draft several times**.

A recent analysis of DiffusionGemma emphasizes this point as well [[Asaria et al., 2026](https://arxiv.org/abs/2606.14620)]. The paper asks whether DiffusionGemma is truly parallel or whether it behaves almost autoregressively in practice, using commit order and confidence to trace the process. The interesting conclusion is that the model does not fall neatly into either category. DiffusionGemma commits many tokens in large batches, but in some situations it still shows a weak left-to-right bias.

The question I want to ask in this post is simple: **What does DiffusionGemma parallelize, and what does it still process sequentially?** And what roles do self-conditioning, EB sampling, and the canvas play in the actual generation process?

<figure>
    <img src="2026-diffusion-gemma-structure.webp" />
    <figcaption>
    <figtitle> The basic structure of DiffusionGemma. The prompt is processed once, and the canvas is denoised over multiple steps. </figtitle>
    <figdetail>
The user's prompt is first processed during the prefill stage, and the resulting KV cache is reused throughout the denoising loop.
The full prompt is therefore not recomputed at every step.

[Computation]
1. A fixed-length token canvas starts from a noisy state.
2. At each denoising step, the logits and self-conditioning vector for the whole canvas are updated together.
3. EB sampling keeps only high-confidence positions as tokens, while uncertain positions are returned to noise.
    </figdetail>
    </figcaption>
</figure>

<hr class="h2-separation">

## Overall Structure

The simplest way to describe DiffusionGemma is **prompt prefill + bidirectional canvas denoising**.

The prompt is processed first during the prefill stage. This creates a KV cache for the prompt context, and that cache is reused throughout the denoising loop. In other words, the model does not recompute the entire prompt at every step.

The canvas, however, is recomputed at every denoising step. The canvas tokens keep changing, and the self-conditioning vector is updated at each step as well. Therefore the hidden states, QKV values, attention outputs, and logits on the canvas side must be newly computed for each denoising step.

In short:

**Prompt side**

* The user's input prompt is processed once.
* A KV cache is created for the prompt.
* This KV cache is reused during the denoising steps.

**Canvas side**

* The model uses a fixed-length token canvas.
* It starts from a noisy token state.
* At every step, the entire canvas passes through the Transformer.
* Bidirectional attention is possible inside the canvas.
* Therefore later token candidates can influence revisions to earlier tokens.

This is the biggest difference from an autoregressive model. An autoregressive model cannot revise tokens that have already been generated, but DiffusionGemma repeatedly revises the whole canvas, so earlier tokens can still change in later steps.

However, this does not mean that all tokens are completely decided at the same time. In the actual commit process, multiple tokens may be finalized in large groups, and the order of commitment can vary by task and position. So it is more accurate to say that **computation is parallelized at the canvas level, while token commitment happens gradually across denoising steps**.

<hr class="h2-separation">

## Denoising Step

At a single denoising step, the model receives both the previous canvas tokens and the previous self-conditioning vector.

Here, the canvas token is a discrete state, while the self-conditioning vector is a continuous state. Roughly speaking, we can think of the model as adding a transformed self-conditioning vector to the previous canvas token embedding before passing the whole canvas into the Transformer.

One step proceeds roughly as follows:

* The model has the previous canvas token $o^{t-1}$.
* It also has the previous self-conditioning vector $S^{t-1}$.
* Using both, it performs a Transformer forward pass over the whole canvas.
* For each canvas position, it produces vocabulary logits $l_i^t$.
* From these logits, the model constructs the next self-conditioning vector $S^t$ and candidate token $\hat{o}^t$.

The important point is that **the self-conditioning vector and the canvas token come from the same logits, but they are not the same thing**.

The self-conditioning vector is a soft representation that sends the logit distribution into embedding space. It can be written approximately as:

$$
S^t = \text{softmax}(l^t / \tau) W_E
$$

That is, $S^t$ is not a single top-1 token. It is a mixture of multiple token candidates in embedding space, weighted by their probability distribution. It is closer to the model's "soft belief" about that position.

By contrast, the canvas token $o^t$ is the result of applying EB sampling to a sampled candidate token. So $o^t$ should not be interpreted as the top-1 token of $S^t$.

This distinction may look small, but it is crucial for understanding DiffusionGemma. The model is not merely selecting one token. It maintains **a continuous belief state and a discrete noisy canvas state at the same time**.

<hr class="h2-separation">

## Self-Conditioning

At first, a natural question arises:

> If $S^t$ is made from the logits, is the nearest token to $S^t$ simply $o^t$?

The answer is no. At each step, the logits are used in two different ways.

* One branch creates the self-conditioning vector.
* The other branch samples a candidate token.

The candidate token is drawn through categorical sampling. It therefore does not have to be the argmax or top-1 token. After that, EB sampling decides whether to keep the sampled token or return that position to a noisy token.

So it is better to understand the two states as follows:

* $S^t$ is the model's **soft belief state**.
* $o^t$ is the **discrete noisy token state** that actually enters the canvas at that step.
* The top token of $S^t$ can be inspected for interpretability, but it is not always identical to the actual canvas token.

Once this distinction is clear, the structure of DiffusionGemma becomes much easier to see. Self-conditioning is not a mechanism for directly choosing the next token. It is closer to a **continuous memory state** that helps the denoising trajectory retain information from the model's previous judgments.

<hr class="h2-separation">

## EB Sampling

At each denoising step, DiffusionGemma samples candidate tokens for every canvas position. But it does not use all of those candidate tokens directly. High-confidence positions are kept, while low-confidence positions are replaced again with random tokens. This is EB sampling, or **Entropy-Bounded sampling**.

The intuition is simple. If the model is confident about a position, it keeps that token. If the entropy is high and the model is still uncertain, it avoids prematurely fixing a weak token and returns the position to noise.

The procedure is roughly:

* Compute the entropy of the token distribution at each canvas position.
* Sort positions from low entropy to high entropy.
* Keep low-entropy positions that fall within a certain entropy bound.
* For the kept positions, retain the sampled candidate token.
* For the remaining positions, renoise them with random tokens.

The key point is that **only the canvas token is replaced by a random token**. The self-conditioning vector $S^t$, computed as a soft belief from the logits, is still passed to the next step.

So random renoising does not erase all information. What gets removed is the uncertain discrete token commitment. At the next step, the model can reconsider the position using the prompt KV cache, the surrounding canvas context, and the self-conditioning vector.

This gives us the following picture:

* $S^t$: a soft state that preserves the continuous direction of computation
* $o^t$: the noisy discrete instantiation at the current step
* EB sampling: a mechanism that commits only confident positions and leaves uncertain ones open

In this sense, EB sampling is not just a sampling trick. It is a core mechanism that lets DiffusionGemma "fix what it is confident about and postpone what remains ambiguous."

<hr class="h2-separation">

## Canvas and KV Cache

Does the canvas have QKV values? Yes. The canvas is also a token sequence entering the Transformer, so each layer computes Q, K, and V for it.

But this differs from autoregressive decoding. In a standard autoregressive model, when generating a new token, the model can reuse the KV cache for previous tokens. Those previous tokens are already fixed, and later tokens cannot influence earlier ones.

DiffusionGemma's canvas is different. Attention inside the canvas is bidirectional. If the token at one position changes, it is not only that position that changes. Other positions may also attend to that token differently. Therefore canvas QKV must be recomputed at every denoising step.

In short:

* The prompt KV cache is reused.
* Canvas QKV is recomputed at every step.
* Bidirectional attention is possible inside the canvas.
* This allows the model to use later reasoning to revise earlier answers.

This is what produces DiffusionGemma's non-autoregressive behavior. It is not merely that the model outputs many tokens at once. The important part is that different positions inside the canvas repeatedly influence one another.

<hr class="h2-separation">

## Multi-Canvas Sampling

If DiffusionGemma uses a fixed-length canvas, how does it generate answers longer than that canvas?

In that case, it uses multi-canvas sampling. First, the model denoises and completes the first canvas. Then the completed canvas is appended to the prompt/context and reflected in the KV cache. After that, the model starts a new canvas.

So within a single canvas, generation is diffusion-based and bidirectional. Between canvases, however, it proceeds in a block-autoregressive manner.

For that reason, it is difficult to call DiffusionGemma a fully non-autoregressive model. A more precise description is:

> DiffusionGemma performs diffusion-based bidirectional generation inside each canvas, and block-autoregressive generation across canvases.

Recent commit-order analysis adds one more point. The actual token commitment order is neither "fully parallel" nor a fixed block-autoregressive order. Many tokens commit at once, but partial ordering appears differently depending on the task and the measurement granularity. Ultimately, DiffusionGemma's generation process should be understood by looking not only at the architecture, but also at the **denoising trajectory and commit events**.

<hr class="h2-separation">

## Strengths and Limitations

DiffusionGemma's biggest advantage is not necessarily raw benchmark score. Its value is better understood in terms of **fast generation at low batch sizes** and the **structural flexibility of bidirectional canvas generation**.

A standard autoregressive model generates one token at a time. This can be efficient when many user requests are batched together, but for a single user interacting with a local GPU, it can create a memory bandwidth bottleneck. The model has to repeatedly read the weights for every token, and it may fail to fully use the GPU's parallel compute capacity.

DiffusionGemma approaches this problem differently. It processes the whole canvas at once, giving the GPU a larger parallel computation. The goal is to move decoding from a memory-bound regime closer to a compute-bound regime.

Its strengths can be summarized as:

* **Fast single-user inference**  
  Instead of generating one token at a time, the model denoises multiple tokens at the canvas level.

* **Bidirectional attention**  
  Because every position in the canvas can attend to every other position, this structure may be useful for code infilling, inline editing, structured output, mathematical structures, and nonlinear domains such as amino acid sequences.

* **Self-correction**  
  Tokens that appear early can be revised later. The model is not permanently bound to a token once it has produced it, as an autoregressive model would be.

* **Adaptive stopping**  
  For simple tasks, the model can use fewer denoising steps and stop early. For complex tasks, it can use more steps.

Still, we should be careful about performance claims. It is difficult to say that DiffusionGemma is generally a "stronger model." Its value is better seen through the lens of a **latency-first, interaction-first model** rather than through benchmark accuracy alone. The best choice may differ depending on whether one cares most about the highest-quality single answer or fast local inference.

<hr class="h2-separation">

## Interpretability

DiffusionGemma is interesting not only because it is fast. It creates intermediate computational states in a way that differs from conventional autoregressive LLMs.

In an autoregressive model, a natural-language token sequence such as chain-of-thought can expose part of the intermediate reasoning. Of course, this reasoning is not always faithful, but at least it is often externalized as a token sequence.

DiffusionGemma, by contrast, passes two intermediate states between denoising steps:

* Canvas token $o^t$
* Self-conditioning vector $S^t$

The canvas token is readable, but the self-conditioning vector is a dense vector and is not directly readable. This raises an important question:

> Is DiffusionGemma hiding intermediate reasoning in a latent space that humans cannot read?

This question matters for interpretability. If the self-conditioning vector is a completely opaque hidden code, then the final output and intermediate canvas tokens are not enough to understand the model's computation. But if the self-conditioning vector is a soft token mixture that is reasonably aligned with token embedding directions, then top-k token candidates or changes in the distribution may already explain a substantial part of the denoising trajectory.

Several diffusion-specific behaviors observed in DiffusionGemma connect to this issue.

First, **early length prediction** is possible. Before fully deciding the content of the answer, the model can estimate the total response length through padding token probabilities. This means it may decide "how long the answer should be" before deciding exactly "what to say."

Second, **retroactive self-correction** is possible. The model may initially predict a wrong answer, then revise an earlier answer token after later reasoning has stabilized. An autoregressive model cannot take back an answer token it has already emitted, but DiffusionGemma can revise the entire canvas.

Third, **token smearing** can appear. When the model knows which token it needs but does not yet know exactly where to place it, the probability of that token can spread across nearby positions. As denoising proceeds, it later converges to a specific position.

Fourth, **sequence smearing** is also possible. Multiple candidate sequences can be maintained at once before one of them wins. This suggests that DiffusionGemma can temporarily preserve sequence-level alternatives, not only token-level candidates.

Fifth, **intermediate-context reasoning** can occur. A token may not appear in the final output but may still be used for intermediate computation. For example, in a task where a number must later be replaced by another string, the model may internally generate the number first, use it to compute the next term, and then replace it in the final output.

These phenomena show that interpreting DiffusionGemma's intermediate states requires more than looking at the final output. What matters is the **entire denoising trajectory**.

<hr class="h2-separation">

## Summary

DiffusionGemma is not a model that completely abandons token-by-token generation. It is better understood as a model that turns generation into **block-level iterative refinement**.

At every step, the model maintains two states. One is the discrete token state currently placed on the canvas. The other is the continuous self-conditioning state produced from the logits. These two states move together, allowing the model to fix high-confidence positions while leaving uncertain positions open.

So DiffusionGemma's generation is not just decoding. It is a process in which the model **updates its computational state several times until the output structure gradually converges**.

The core ideas can be summarized in three parts:

* **Canvas**: a generation space that handles multiple token positions at once
* **Self-conditioning**: a soft belief state produced from the logits
* **EB sampling**: a selection mechanism that keeps high-confidence tokens and returns uncertain tokens to noise

In this sense, DiffusionGemma is not merely a faster model. It is an experiment in shifting LLM generation from "sequential writing" to "iterative refinement." And that experiment also raises new questions about how we should think about latent reasoning, monitorability, and interpretability.
