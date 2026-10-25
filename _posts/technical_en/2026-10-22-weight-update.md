---
layout: post
title: "Non-Monotonic Knowledge Updates in Neural Networks"
permalink: /blog/2026/weight-update-en/
mini-title: "Knowledge Updates"
---

*Understanding knowledge editing, machine unlearning, and continual learning through weight updates.*

Adding information is only one part of learning. A model may also need to correct a fact, remove the influence of training examples, or stop relying on a conclusion whose evidence has been withdrawn. Each change raises a preservation question:

> When new information is introduced, corrected, or withdrawn, how can a neural network update its knowledge while preserving what should remain valid?

This article uses **changing knowledge under retention constraints** as a shared lens. Knowledge editing, machine unlearning, and continual learning approach that problem with different targets. They are not interchangeable forms of non-monotonic reasoning. In particular, continual learning can accumulate compatible knowledge without retracting anything. Here, *non-monotonic* refers to the possibility that an accepted conclusion must be revised when its justification changes; a weight update alone does not implement that semantics.

## A unified view of weight updates

Let the current parameters be $\theta$. A useful comparison framework is

$$
\boxed{\min_{\Delta\theta}\;
\mathcal L_{\mathrm{change}}(\theta+\Delta\theta;\mathcal C_t)
+\lambda\mathcal L_{\mathrm{retain}}(\theta+\Delta\theta;\mathcal R_t)
+\mu\Omega(\Delta\theta).}
$$

Here $\mathcal C_t$ specifies the requested changes, and $\mathcal R_t$ specifies behavior or knowledge to retain. The change loss encourages the desired update; the retain loss penalizes damage to the preservation set. The regularizer $\Omega$ constrains update size or direction, with weights $\lambda,\mu\geq0$.

This is an **analytical framework**, not a standard objective shared verbatim by all the methods below. Hard constraints, closed-form matrix updates, and gradient projections implement different trade-offs. Crucially, the equation assumes someone has already decided what belongs in the change and retain sets. It does not decide which knowledge is justified.

| Area | Requested change | Main preservation problem |
| --- | --- | --- |
| Knowledge editing | Replace a targeted association | Preserve unrelated facts and capabilities |
| Machine unlearning | Remove specified training influence | Preserve retain-set behavior and general utility |
| Continual learning | Learn tasks or information sequentially | Preserve useful earlier performance while adapting |

A changed answer is not necessarily evidence that the underlying learned information has been deleted.

## Knowledge editing: update directions and preservation

The explorer contains eight representative entries across the three areas. Select a method, then inspect its **Objective**, **Weight Update**, **Preservation Mechanism**, and **Limitations**. Equations use normalized notation; the accompanying notes distinguish core relations from configurable baselines and local approximations.

<div class="weight-update-explorer" data-weight-update-urls='["{{ "/assets/jsons/weight_update_knowledge_maintenance.json" | relative_url }}"]' aria-label="Knowledge update method explorer">
  <div class="weight-update-status" role="status">Loading knowledge-update methods…</div>
</div>

**FT-Edit** is a baseline recipe: optimize edited answers and use locality examples to discourage collateral changes. **ROME** instead solves a rank-one update for one fixed key-value association, using background-key second moments to reduce interference. **MEMIT** extends this idea to batches and distributes residual targets across selected MLP layers. Their linear fitting conditions should not be confused with guarantees about every generated answer. See the original [ROME](https://rome.baulab.info/) and [MEMIT](https://memit.baulab.info/) papers and project pages.

### AlphaEdit and CrispEdit protect different spaces

[AlphaEdit](https://proceedings.iclr.cc/paper_files/paper/2025/hash/29c8c615b3187ee995029284702d3f43-Abstract-Conference.html) uses preserved input keys to define a null-space restriction. In the exact linear setting, the protection condition is

$$
\Delta W K_{\mathrm{preserve}}=0.
$$

The update leaves those fixed key mappings unchanged. In practice, selecting small singular values rather than exact zeros makes preservation approximate. This condition concerns selected representations, not every end-to-end output or every consequence of a fact.

[CrispEdit](https://proceedings.mlr.press/v306/ikram26a.html) defines protection through changes in model capabilities on reference data. A local schematic condition is

$$
\Delta\theta^\top H_{\mathrm{cap}}\Delta\theta\leq\epsilon.
$$

Its actual construction starts with a Bregman divergence, obtains Gauss–Newton curvature, and uses K-FAC to project gradients into low-curvature directions. The quadratic expression is a local intuition for capability preservation, not the complete algorithm or a claim of exact global protection.

Both methods restrict interference, but their protected spaces mean different things: **preserved input mappings** in AlphaEdit and **capability-loss curvature** in CrispEdit. Neither geometry establishes whether a protected assertion remains supported by current evidence.

## Machine unlearning: what counts as forgetting?

Gradient ascent (GA) increases negative log-likelihood on forget examples. Gradient difference (GradDiff) adds ordinary training on retain examples:

$$
\mathcal L_{\mathrm{GradDiff}}=-\mathcal L_{\mathrm{forget}}+\lambda\mathcal L_{\mathrm{retain}}.
$$

With this sign convention, both component losses are negative log-likelihoods. Minimizing the first term makes the forget responses less likely; minimizing the second helps preserve utility. Pure GA sets $\lambda=0$ and can severely degrade the model.

[Negative Preference Optimization (NPO)](https://arxiv.org/abs/2404.05868) compares forget-response probabilities against a frozen reference. Its gradient contributions shrink when the current-to-reference probability ratio becomes small. Bare NPO has no explicit retain-set term; retention losses are separate augmentations.

The semantic question is different: **reducing the probability of an answer is not necessarily equivalent to retracting its supporting evidence.** Unlearning seeks to remove training-data influence, often evaluated against a model retrained without that data. Withdrawing a proposition from a belief system requires a policy for evidence and inference. Success at one does not establish success at the other.

## Continual learning: should earlier knowledge always be preserved?

[Elastic Weight Consolidation (EWC)](https://doi.org/10.1073/pnas.1611835114) penalizes changes to parameters estimated to matter for a previous task:

$$
\mathcal L_{\mathrm{EWC}}=\mathcal L_{\mathrm{new}}(\theta)+\frac{\lambda}{2}\sum_i F_i(\theta_i-\theta_i^*)^2.
$$

Here $\theta^*$ is the earlier solution and $F_i$ is a diagonal Fisher estimate of parameter importance. This is the single-previous-task formulation; longer task sequences require a stated consolidation scheme.

EWC addresses stability–plasticity: adapting without unnecessarily losing earlier performance. But importance is not validity. An old representation can be important for a benchmark and still encode an assertion that new evidence invalidates. EWC does not make that semantic judgment, and compatible continual learning may require no retraction at all.

## Parameter preservation versus semantic preservation

| Preservation criterion | Representative approaches | What is protected |
| --- | --- | --- |
| Parameter distance or importance | Regularized FT, EWC | Proximity to an earlier solution, possibly weighted by importance |
| Input representations | ROME, MEMIT, AlphaEdit | Mappings on selected keys or their distribution |
| Functional behavior or capability | CrispEdit, output-KL constraints | Behavior on reference prompts or capability data |
| Semantic validity | Research requirement, not supplied by these constraints alone | Conclusions justified by currently valid evidence and rules |

These categories overlap. ROME and MEMIT also minimize functional interference in a linearized memory model, while EWC uses parameter geometry as a proxy for performance. The distinction is about the **criterion being enforced**, not a strict taxonomy.

Preserving earlier behavior does not prove its continued validity. A small parameter change can also produce a large semantic change. Conversely, correcting one assertion may legitimately require many related answers to change. Locality should therefore be judged against intended dependencies, not just against whether the original model gives the same answers.

## From weight updates to knowledge maintenance

Suppose two independent, sufficient supports, A and B, each justify conclusion C. Withdrawing A does not require withdrawing C while B remains valid. If both are withdrawn and there are no other supports, C loses its justification. That does not establish that C is false.

<figure class="support-demo" aria-labelledby="support-demo-title">
  <p id="support-demo-title"><strong>Withdraw evidence, then reassess the conclusion</strong></p>
  <div class="support-demo-controls">
    <label><input type="checkbox" id="support-a" checked> Evidence A is valid</label>
    <label><input type="checkbox" id="support-b" checked> Evidence B is valid</label>
  </div>
  <div class="support-demo-flow"><span id="support-a-state">A → C</span><span id="support-b-state">B → C</span><strong id="support-conclusion">C remains justified</strong></div>
  <p id="support-explanation" role="status">Both independent supports are valid. Either one is sufficient for C.</p>
  <figcaption>A toy support model, not a simulation of neural weights. Uncheck A: C stays justified through B. Uncheck both: C becomes unsupported, rather than false.</figcaption>
</figure>

A semantic evaluation condition can be written schematically as

$$
\operatorname{Accepted}_{t+1}(p)=\operatorname{ValidSupport}(p,E_{t+1},\mathcal R_{t+1}).
$$

Here $E_{t+1}$ denotes the current evidence, $\mathcal R_{t+1}$ the applicable inference rules, and the right-hand side is a Boolean acceptance criterion under a specified support policy. This notation does not imply that an ordinary neural model stores an explicit evidence graph. It states a property we would like to evaluate. Conflicting evidence, defeasible rules, and alternative support policies require a richer account than this toy example.

## Evaluation and dataset design

Evaluate three separate questions:

| Criterion | Required probe | Relation to existing evaluation |
| --- | --- | --- |
| Change correctness | Does the intended correction hold across paraphrases and dependent questions? | Related to editing efficacy and generalization |
| Retention correctness | Do still-valid facts and independently supported conclusions remain correct? | Related to locality, retain utility, and continual-learning stability |
| Retraction correctness | Are conclusions that lost all valid support no longer accepted, while independently supported ones remain? | Requires evidence-sensitive probes beyond simple answer suppression |

Use paired evidence states: both A and B valid; only A valid; only B valid; neither valid. Specify the inference rules and expected acceptance status for each state. Include unrelated controls, consequences that should change, and paraphrases. A system that always preserves C or always deletes C after any withdrawal should fail different parts of this test.

Existing resources serve narrower roles. [CounterFact and zsRE in the ROME evaluation](https://rome.baulab.info/) probe targeted editing and generalization. [TOFU](https://arxiv.org/abs/2401.06121) provides a controlled setting for forget/retain evaluation. Sequential task benchmarks in the [EWC paper](https://doi.org/10.1073/pnas.1611835114) probe forgetting across tasks. None of these roles, by itself, establishes dependency-aware retraction. Support annotations and changed-evidence probes must be added explicitly.

For unlearning, also report comparison to the appropriate retrained reference and relevant extraction or privacy tests. Semantic support tests complement these checks; they do not replace the unlearning objective. This article proposes an evaluation perspective, not new experimental results or a validated benchmark.

## Open questions

How should change and retain sets be constructed when evidence conflicts? Can we distinguish a memorized answer from the independently valid reasons for accepting it? How should preservation geometry be refreshed after repeated edits? And how can dependency-sensitive evaluation scale beyond small, explicitly annotated support graphs?

> Existing weight-update methods primarily control how parameters or model behaviors change. From a non-monotonic perspective, the deeper challenge is determining which knowledge should change, which should remain, and whether those decisions remain justified as evidence evolves.

<noscript>The method explorer requires JavaScript. The main comparisons, equations, source links, and support example remain available in the article.</noscript>

<link rel="stylesheet" href="{{ '/assets/css/knowledge-maintenance.css' | relative_url }}">
<script defer src="{{ '/assets/js/weight-update.js' | relative_url }}"></script>
<script defer src="{{ '/assets/js/posts/knowledge-support.js' | relative_url }}"></script>
