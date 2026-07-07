---
layout: post
title: Conditional Antibody Generation
permalink: /work/2026/antibody-generation/
mini-title: HER2 Antibody Generation
back-fallback: /work/
code-url: https://github.com/leobumjin/her2-antibody-conditional-generation
code-label: Code
---

This project was carried out in collaboration with AinB. The work was shaped together with an AI mentor and two protein AI researchers at AinB, Kwonwoo Ha and Dohyung Lee, with the shared goal of exploring how modern protein representation models and conditional generators can support antibody design workflows.

<figure>
    <img src="2026-antibody-task-figure.webp" />
    <figcaption>
    <figtitle>Conditional Antibody Generation Task</figtitle>
    </figcaption>
</figure>

At a high level, this study focuses on **HER2 antibody generation** with ZymCTRL-based sequence modeling. The practical question is simple but important: can we generate candidate antibody sequences that are not only syntactically valid, but also more likely to preserve binder-like properties under a learned energy model?

This matters because antibody engineering is still expensive, iterative, and data-constrained. In many realistic settings, researchers do not want an unconstrained language model that simply writes plausible protein strings. They want a controllable generator that can search around known functional sequence space, bias generation toward promising regions, and still preserve diversity. That is exactly where conditional generation, learned scoring functions, and representation-based search become valuable.

Recent protein AI work gives us the ingredients for this kind of workflow. Large protein language models provide expressive sequence representations. Classifier-style models on top of ESM embeddings can be used as surrogate evaluators. Conditional language models can then use those signals either implicitly through supervised fine-tuning or explicitly through guidance and reinforcement learning. The interesting research question is not whether these ingredients exist independently, but **how they behave when combined in one practical antibody-generation pipeline**.

In this blog-style report, we walk through that pipeline. We first introduce an ESM-based exploration strategy for building and selecting energy models. We then compare several generation methods built on top of ZymCTRL, including supervised baselines, activation guidance, and reward-driven learning. Finally, we summarize what worked, what failed, and what this tells us about controllable antibody generation under a fixed scaffold setting.

<hr class="h2-separation">

## Problem Setup

The dataset is centered on HER2 antibody CDRH3 sequence variants. The core sequence-level labels indicate whether a candidate is treated as binder-like or non-binder-like in the training setup.

For this project note, I used a **1,000-example working subset** rather than the full HER2 antibody pool. The full pool is much larger, but the experiments here should be read as a compact prototype study: enough to compare representation choices and generation behavior, but not as a final full-dataset benchmark.

This distinction matters for interpretation. The reported energy-model scores and generation comparisons are useful for understanding relative behavior across methods, but they should not be treated as definitive estimates of full-scale antibody design performance.

In this subset setting, the goal is not to exhaust the entire sequence space. The goal is to test whether a small, practical pipeline can:

- build a usable ESM-based binder proxy
- compare several controllable generation strategies
- reveal failure modes such as reward over-optimization and diversity collapse

The scaffold-aware setting uses a fixed antibody framework outside the designed CDRH3 region. The common prefix up to the CDRH3 insertion point is:

```text
EVQLVESGGGLVQPGGSLRLSCAASGFNIKDTYIHWVRQAPGKGLEWVARIYPTNGYTRYADSVKGRFTISADTSKNTAYLQMNSLRAEDTAVYYCSR
```

The wild-type CDRH3 reference used in the scaffold template is:

```text
WGGDGFYAMD
```

This detail is important for interpreting results. The scaffold-aware setting is not unconstrained full-length antibody generation. It is scaffold-conditioned CDRH3 generation.

<hr class="h2-separation">

## Method

Our method has two connected parts: an ESM-based search stage for building an energy model, and a generation stage for comparing different controllable sequence-generation strategies.

### 1. ESM-Based Exploration

The first step is to train a surrogate energy model that can score sequences according to binder-like behavior. Instead of committing to a single protein representation design from the start, we sweep over several ESM backbones and several ways of extracting features from them.

The search space includes:

- multiple ESM model sizes: `esm2-8m`, `esm2-35m`, and `esm2-650m`
- multiple activation types: layer, MLP, and attention representations
- multiple input formats: antibody only, antibody with CDRH3 pooling, antigen-aware variants, and full-sequence pooling variants
- multiple classifier heads: linear and two-layer heads

This stage is important because the generation model is only as useful as the signal it is optimized against. If the energy model is weak or unstable, stronger optimization in generation can actually make results worse by overfitting to noise. That is why we treat energy-model design as a real model-selection problem rather than as a fixed preprocessing step.

<figure>
    <img src="2026-antibody-energy_pooling_layer_scores.webp" />
    <figcaption>
    <figtitle>Layer-wise ESM energy-model search across pooling and input modes.</figtitle>
    <figdetail>
Performance varies meaningfully by ESM size, input structure, activation type, and pooling location. Larger backbones are often stronger, but not uniformly across every setup. In several cases, representation choice and pooling location matter as much as raw model size.
    </figdetail>
    </figcaption>
</figure>

### 2. Generation Methods

Once an energy model is selected, we compare several ways of generating antibody candidates with ZymCTRL as the backbone generator.

**Baseline.** The baseline is supervised conditional fine-tuning. In the full-context setting, the model is trained with the antibody scaffold context while focusing loss on the CDRH3 region. This gives us a clean reference point for what supervised learning alone can do without explicit reward optimization.

**Guidance.** The guidance model uses the same ZymCTRL family and conditioning setup, but adds activation-level guidance from a classifier built on ESM-derived features. Conceptually, this lets us bias hidden-state trajectories toward regions that look more binder-like under the guidance model, while still remaining within a supervised training framework.

**RL variants.** We also compare reward-driven methods such as RL-DPO, RL-GRPO, and RL-PPO, with and without entropy regularization. These methods explicitly optimize toward better energy-model scores. In principle, they should improve positive fraction and mean positive probability. In practice, they also risk sacrificing diversity or drifting toward narrow solutions, which is why we evaluate them with both quality and distance-based metrics.

### 3. Two Generation Contexts

We use two related generation contexts:

- `CDR3 Only`: the model directly generates CDRH3 sequences
- `Full Sequence`: the model operates with full antibody scaffold context, but generation is still centered on the CDRH3 region and then reinserted into the scaffold for evaluation

This distinction turns out to matter. The same optimization strategy can behave very differently depending on whether it is operating in a short local design space or a scaffold-aware setting.

<hr class="h2-separation">

## Energy Model Results

Even in the 1,000-example subset, the energy model is not a trivial component. Performance varies meaningfully by ESM size, by input structure, and by pooling location. The main takeaway from this stage is that a well-chosen representation pipeline is already doing a large part of the work before any generation-time optimization begins.

Layer counts:

- `esm2-8m`: 6 layers
- `esm2-35m`: 12 layers
- `esm2-650m`: 33 layers

Best energy-model checkpoint per pooling/input mode in this subset experiment:

| ESM Model | Pooling / Input | Test Accuracy (Layer) | Test AUROC (Layer) | Activation | Classifier |
|---|---|---:|---:|---|---|
| `esm2-8m` | Antibody / CDRH3 | 0.7910 (L2) | 0.8783 (L2) | mlp | linear |
| `esm2-8m` | Antibody / Full | 0.7700 (L5) | 0.8393 (L5) | layer | 2layer |
| `esm2-8m` | Antigen + Antibody / CDRH3 | 0.7990 (L1) | 0.8750 (L1) | mlp | linear |
| `esm2-8m` | Antigen + Antibody / Full | 0.7310 (L1) | 0.8065 (L1) | layer | 2layer |
| `esm2-35m` | Antibody / CDRH3 | 0.7990 (L1) | 0.8696 (L1) | mlp | linear |
| `esm2-35m` | CDRH3 / Full | 0.7780 (L10) | 0.8578 (L10) | mlp | 2layer |
| `esm2-650m` | Antibody / CDRH3 | 0.8060 (L7) | 0.8812 (L7) | mlp | linear |
| `esm2-650m` | Antibody / Full | 0.7950 (L28) | 0.8601 (L28) | mlp | linear |
| `esm2-650m` | CDRH3 / Full | 0.7960 (L7) | 0.8700 (L7) | mlp | linear |

Across the selected configurations, the strongest AUROC appears in the `esm2-650m` antibody/CDRH3 setting, reaching `0.8812`. The strongest accuracy also comes from `esm2-650m`, with `0.8060` in the same setting. These numbers are best read as **subset-level model-selection signals**, not as final deployment metrics. Still, they support the use of the larger representation model as a useful binder proxy, while showing that layer and pooling choices remain essential.

<hr class="h2-separation">

## Generation Comparison

After selecting the ESM-based energy model, the next question is how different generation strategies behave under the same scoring lens. The radar plot below summarizes that comparison across 256 generated samples for each setting.

<figure>
    <img src="2026-antibody-generation_metrics_radar_256.webp" />
    <figcaption>
    <figtitle>Generation metrics across baseline, guidance, and RL variants.</figtitle>
    <figdetail>
The radar plot compares energy-facing quality metrics, such as positive fraction and mean positive probability, with diversity and distribution-distance metrics. Results are shown for both CDR3-only and full-sequence contexts, so the same method can be compared across a short local generation task and a scaffold-aware generation task.
    </figdetail>
    </figcaption>
</figure>

Several useful patterns stand out from the plot:

- In the `CDR3 Only` setting, `RL-DPO` gives the strongest energy-facing signal, reaching the outer edge on both positive fraction and mean positive probability.
- The supervised baseline and guidance runs preserve stronger distance-based diversity in the CDR3-only setting, especially on train/test distance mean and test distance standard deviation.
- Entropy regularization changes the RL behavior substantially. For example, `RL-DPO + Entropy (0.5)` keeps high positive fraction while pulling the shape closer to the diversity axes than plain `RL-DPO`.
- In the `Full Sequence` setting, most RL variants reach very high positive fraction and mean positive probability, but this comes with visibly different diversity profiles.
- `RL-PPO` and `RL-GRPO` keep high uniqueness in the full-sequence panel, while their distance-to-training/test-distribution behavior differs from `RL-DPO`.
- `RL-DPO` in full sequence has a wide footprint across quality and distance axes, but the qualitative samples later show why this has to be interpreted carefully: high metric coverage can still hide repeated or motif-collapsed outputs.

The overall generation comparison shows three main patterns.

First, reward-driven methods can substantially improve energy-model-facing metrics. In particular, RL-DPO and some RL variants push positive fraction and mean positive probability much higher than the supervised references. This suggests that the energy model is indeed informative enough to shape generation behavior.

Second, those gains do not automatically mean better overall design behavior. Some RL settings show clear collapse in diversity or produce narrow sequence families. In other words, optimization against the reward works, but it can become too strong relative to the diversity objective.

Third, the `CDR3 Only` and `Full Sequence` contexts behave differently. The same method can look stable in one regime and much less stable in the other. This is a useful reminder that scaffold-aware generation is not simply a longer version of the short-sequence task. The optimization landscape changes.

<figure>
    <img src="2026-antibody-generation_training_curves.webp" />
    <figcaption>
    <figtitle>Training curves for supervised, guided, and reward-driven generation.</figtitle>
    <figdetail>
The supervised models show smooth decreases in total loss, which is expected from stable fine-tuning. RL models show more varied reward trajectories: some rise quickly and continue improving, while others plateau or move toward narrow high-reward regions.
    </figdetail>
    </figcaption>
</figure>

This is one of the most practically important observations in the project. In protein generation, **better reward is not enough**. We need to ask what kind of sequences the model becomes confident about, whether uniqueness survives, and whether the model is still exploring meaningful neighborhoods of sequence space.

<hr class="h2-separation">

## Qualitative Samples

The generated samples help ground the metrics. The supervised models tend to stay closer to familiar patterns, while some RL runs visibly collapse into repetitive or highly constrained motifs. That qualitative behavior is consistent with the diversity statistics in the quantitative tables.

### CDR3 Only

The CDR3-only baseline produces short, plausible variants around the familiar `W...GFY...` pattern:

| Method | Example Generated Sequences |
|---|---|
| Baseline | `WAAGGFYVF`, `WAAPGFYAF`, `WAACGFYVF`, `WGADGFYAF`, `WSAPGFYAF` |
| Guidance | `WNAGGFYAF`, `WSLGGFYVF`, `WALNGFYAF`, `WATCGFYAF`, `WSLDGFYVF` |
| RL-DPO | `WAAGRAAAAA`, `WAAPRRAAAA`, `WAACRAAAA`, `WGADRAAAAA`, `WSAPRRAAAA` |
| RL-GRPO | `WAAGM`, `WAAPM`, `WAACM`, `WGADM`, `WSAPM` |
| RL-PPO | `WAAG`, `WAAP`, `WAAC`, `WGAD`, `WSAP` |

This is a clear illustration of the reward-diversity trade-off. RL optimization can move the model strongly, but in several settings it also shortens or collapses the sequence family.

### Full Sequence

The full-context setting shows a different failure pattern:

| Method | Example Generated Sequences |
|---|---|
| Guidance | `FSGNGMYTYDY`, `WAAGRFYTFDY`, `FGNGGFYTLDY`, `WSVIGVYAFDY`, `WSADGMYVFAY` |
| RL-DPO | `GGGARARALE`, `GGGARARALE`, `GGGARARALE`, `GGGARARALE`, `GGGARARALE` |
| RL-GRPO | `GAGGRARAFD`, `GAGGRARAFD`, `GAGGRVARAF`, `GAGGRGRLAR`, `GTARAFGNEE` |
| RL-PPO | `ESRGAARALW`, `GSGAAARAAK`, `GGGAAAAAYN`, `GGGAAARAVA`, `GGGAARTLDF` |
| RL-PPO + Entropy | `ESRGAKRHSW`, `ASGRWGYIGN`, `GASPAGAAYY`, `KNGMEMVAVT`, `AEGKEETPPF` |

The guidance samples remain comparatively diverse and scaffold-aware. Some reward-optimized runs, especially RL-DPO and RL-GRPO, move toward repeated glycine/alanine-rich motifs. Entropy regularization can help preserve variety in some cases, but it does not automatically solve the alignment between reward, validity, and useful diversity.

<hr class="h2-separation">

## Implementation Notes

The experiments were run with matched shells for baseline, guidance, and RL variants. The goal was to keep the comparison as fair as possible while changing only the control mechanism.

Shared defaults for the supervised baseline and guidance runs:

- Backbone: `AI4PD/ZymCTRL`
- Dataset preset: `medium`
- Epochs: `20`
- Batch size: `8`
- Learning rate: `5e-5`
- Weight decay: `1e-4`
- Early stopping patience: `2`
- Max sequence length: `256`
- Prompt length: `16`
- Number of generated evaluation samples: `256`
- Generation max new tokens: `32`
- Temperature: `1.0`
- Top-p: `0.95`
- LoRA enabled: `true`
- LoRA rank: `8`
- LoRA alpha: `16`
- LoRA dropout: `0.05`

For the RL experiments, the defaults were lighter per batch but optimized through repeated reward-based updates:

- Epochs: `6`
- Batch size: `4`
- Rollout samples per prompt: `4`
- Learning rate: `1e-5`
- Weight decay: `1e-4`
- Prompt length: `4`
- Eval samples: `256`
- Length penalty: `0.05`
- Invalid penalty: `0.25`
- Entropy sweep: `0`, `0.5`

For the latest baseline and guidance setup, the full-context training configuration uses `CDR3-only loss`. That means the input sequence can include the full antibody scaffold context, but the loss is applied only on the CDRH3 span. This keeps the comparison focused on the design region rather than encouraging the model to relearn fixed framework tokens.

In implementation terms, this is done with a boolean `loss_mask` over tokens, aligned to the CDRH3 region. Guidance uses a parallel `guidance_mask` so that activation-level control also focuses on the intended design span.

The energy model is used as a learned binder proxy. It is trained on top of ESM representations, and later reused in two ways:

- as a scoring model for generated candidates
- as a source of guidance or reward signals for conditional generation

This makes representation quality especially important. A weak energy model can create misleading optimization pressure, while a stronger model produces a much more meaningful search signal.

<hr class="h2-separation">

## Takeaway

The central takeaway from this project is that controllable antibody generation is not a single-model problem. It is a **pipeline problem**.

You need:

- a reliable representation space
- a sensible surrogate energy model
- a generator that can be conditioned or optimized without collapsing
- evaluation metrics that reflect both quality and diversity

When those pieces are aligned, reward-driven generation can produce sequences that look much more promising under the learned binder proxy. In this 1,000-example study, that conclusion should be read as a controlled prototype result rather than a full-scale claim. But the failure modes are already visible: when the pieces are not aligned, the model can over-optimize, lose diversity, or exploit weaknesses in the scoring model.

One useful insight is that ESM-based exploration is worth the effort. Choosing the right pooling strategy, layer, and input configuration materially changes how useful the downstream energy model becomes.

Another key insight is that stronger optimization does not always mean better design. RL methods can outperform supervised baselines on energy-facing metrics, but those gains have to be interpreted alongside uniqueness and distance statistics. In antibody design, mode collapse is not a small detail. It directly affects whether the outputs are worth testing.

A final insight is that scaffold-aware generation needs careful wording and careful experimental setup. In our full-context setting, generation is still centered on CDRH3 design rather than unconstrained full-length generation. That distinction matters, both for scientific interpretation and for fair comparison across methods.

This collaboration with AinB shows how protein language models, energy-based scoring, and controllable generation can be combined into a practical antibody research workflow. The current results are not the final answer, especially because this note uses a compact 1,000-example subset. But they do offer a useful roadmap: better surrogate scoring, better calibration between reward and diversity, and cleaner scaffold-aware generation protocols are likely to yield the next step forward.

That makes this line of work exciting. We are no longer only asking whether a language model can generate protein-like strings. We are asking how to turn that ability into a disciplined search process for biologically meaningful candidates.
