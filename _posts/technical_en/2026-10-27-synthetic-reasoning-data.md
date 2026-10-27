---
layout: post
title: "Synthetic Reasoning Data: Formal Generation, LLM Synthesis, and Verification"
permalink: /blog/2026/synthetic-reasoning-data-en/
---

How does synthetic-data generation shape what language models learn—and how well that learning generalizes?

Synthetic reasoning data is not a single category. Some datasets derive tasks from explicit logical rules, executable programs, or structured environments. Others use LLMs to synthesize questions, trajectories, or solutions from prompts and knowledge.

The useful questions are therefore:

1. **What determines the reasoning structure?** An external formal system or a generative model?
2. **What establishes correctness?** Computation, an answer key, an independent verifier, or the generation itself?

This yields two generation paradigms, with verification treated as an independent dimension:

- **Formal Synthetic Data:** tasks come from explicit, controllable computational or logical structures.
- **LLM-Generated Synthetic Data:** a language model constructs the problem, trajectory, solution, or some combination of them.

This is not a distinction between factual and symbolic data. It is a distinction in how reasoning supervision is produced and constrained.

## 1. Two Paradigms of Synthetic Reasoning Data

### Type I: Formal Synthetic Data

Formal data begins with an explicitly defined structure: axioms, relational facts, inference rules, proof trees, executable programs, or state-transition systems. A task is sampled from this structure and solved through its underlying system.

$$
z \sim P_{\mathrm{formal}}(z), \qquad x = G(z), \qquad y = E(z)
$$

Here, (z) is a structured reasoning problem, (G) realizes it as a task, and (E) computes its target. The answer is grounded in an explicit operation—not solely in a plausible model output.

This gives direct control over reasoning depth, rule composition, dependencies, distractors, and sometimes the exact proof. It also enables systematic interventions: a researcher can alter one rule or fact while holding other factors fixed.

Correctness is still relative to the formal system and its implementation. A valid derivation does not guarantee an unambiguous natural-language rendering, a realistic world model, or broad coverage of real reasoning.

### Type II: LLM-Generated Synthetic Data

LLM-generated data begins with a model, a prompt, and possibly conditioning information: existing questions, documents, facts, knowledge-graph triples, or prior reasoning traces. The model constructs part of the training instance.

$$
(x, r, y) \sim P_\theta(\cdot \mid c)
$$

Here, (c) is context and (r) is a generated reasoning trajectory. The trajectory need not be determined by a predefined proof graph or executable procedure.

This can create varied solution patterns, explanations, situations, and linguistic formulations. It can also introduce unsupported assumptions, incomplete deductions, or incorrect answers. External filtering can reduce these errors, so **LLM-generated does not mean unverified**. Its defining feature is that a model participates in constructing the reasoning supervision.

## 2. Generation and Verification Are Separate

The two paradigms describe who constructs reasoning structure; they do not determine how correctness is checked.

$$
\underbrace{\text{Who generates the reasoning?}}_{\text{Generation}}
\neq
\underbrace{\text{Who checks it?}}_{\text{Verification}}
$$

An LLM can generate a trajectory that is accepted only after symbolic execution, exact-answer matching, or another independent verifier. Conversely, a formal generator can produce a correct answer while an LLM-written explanation remains unverified. Final-answer correctness and reasoning validity are not equivalent.

<div class="reasoning-comparison" role="group" aria-labelledby="reasoning-comparison-title">
  <div class="reasoning-comparison-intro"><span class="reasoning-comparison-kicker">At a glance</span><h3 id="reasoning-comparison-title">How the two paradigms differ</h3></div>
  <div class="reasoning-comparison-grid">
    <div class="reasoning-comparison-corner" aria-hidden="true">Dimension</div><div class="reasoning-comparison-heading reasoning-comparison-formal-heading">Formal Synthetic</div><div class="reasoning-comparison-heading reasoning-comparison-llm-heading">LLM-Generated Synthetic</div>
    <div class="reasoning-comparison-label">Starting point</div><div class="reasoning-comparison-value reasoning-comparison-formal">Rules and structured facts</div><div class="reasoning-comparison-value reasoning-comparison-llm">Facts, documents, or existing problems</div>
    <div class="reasoning-comparison-label">Reasoning structure</div><div class="reasoning-comparison-value reasoning-comparison-formal">Specified in advance</div><div class="reasoning-comparison-value reasoning-comparison-llm">Sampled or constructed by the model</div>
    <div class="reasoning-comparison-label">Source of the answer</div><div class="reasoning-comparison-value reasoning-comparison-formal">Rule-based computation or verification</div><div class="reasoning-comparison-value reasoning-comparison-llm">Teacher output, known answers, or external verification</div>
    <div class="reasoning-comparison-label">Primary strength</div><div class="reasoning-comparison-value reasoning-comparison-formal">Control over operations and structural variation</div><div class="reasoning-comparison-value reasoning-comparison-llm">Flexible contexts, language, and trajectories</div>
    <div class="reasoning-comparison-label">Primary risk</div><div class="reasoning-comparison-value reasoning-comparison-formal">Narrow or unrealistic distributions</div><div class="reasoning-comparison-value reasoning-comparison-llm">Teacher errors, biases, and unsupported steps</div>
    <div class="reasoning-comparison-label">Representative work</div><div class="reasoning-comparison-value reasoning-comparison-formal">FLD×2 · ProofWriter · CLUTRR</div><div class="reasoning-comparison-value reasoning-comparison-llm">OpenMathInstruct-2 · MetaMathQA · STaR</div>
  </div>
</div>

## 3. Representative Datasets and Pipelines

### Formal and Programmatic Generation

- **[ProofWriter (2021)](https://aclanthology.org/2021.findings-acl.317/)** derives questions and proofs from synthetic facts and rules for controlled multi-step deduction.
- **[CLUTRR (2019)](https://aclanthology.org/D19-1458/)** uses family-relation graphs to test relational composition beyond observed chain lengths.
- **[FLD×2 (2024)](https://proceedings.nips.cc/paper_files/paper/2024/hash/8678da90126aa58326b2fc0254b33a8c-Abstract-Conference.html)** is a logically controlled corpus with varied rules, natural-language expressions, unknown facts, and distractors. **ALT** is the *Additional Logic Training* method that uses this corpus—not the corpus itself.
- **[GSM-Symbolic (2024)](https://machinelearning.apple.com/research/gsm-symbolic)** changes symbolic templates in mathematical word problems to test numerical and distractor sensitivity.

### LLM-Generated Reasoning Data

- **[OpenMathInstruct-2 (2024)](https://arxiv.org/abs/2410.01560)** augments mathematical data with a large teacher and uses answer-based filtering and voting; it is not unconstrained distillation.
- **[MetaMathQA (2024)](https://proceedings.iclr.cc/paper_files/paper/2024/hash/c400474e8a36d0812fdee52739288b12-Abstract-Conference.html)** rewrites and augments existing mathematical problems with model-generated alternatives.
- **[STaR (2022)](https://arxiv.org/abs/2203.14465)** iteratively generates rationales, retains paths reaching known correct answers, and fine-tunes on the selected demonstrations.
- **[SYNTHETIC-1 (2025)](https://primeintellect.one/blog/synthetic-1-release)** combines model-generated traces with task-specific verification, including executable checking for code tasks.

### Hybrid and Verification-Guided Generation

[OpenThoughts3 (2025)](https://arxiv.org/abs/2506.04178) combines question sourcing, filtering, teacher traces, and answer filtering. [DeepSeek-R1 (2025)](https://doi.org/10.1038/s41586-025-09422-z) combines verifiable rewards, rejection sampling, and supervised fine-tuning. These are not exceptions to the taxonomy: their **generation is LLM-based**, while their **verification is independent**.

### Evaluating Capability Transfer

**[ContinuousBench (2026)](https://arxiv.org/abs/2606.01849)** asks a complementary question: can differentially private synthetic text transfer genuinely new knowledge or capabilities to a model? Its continuously refreshed evaluation settings—including procedurally generated knowledge and recent news—help distinguish apparent post-training gains from performance on material already familiar to the model. The benchmark is therefore especially relevant when assessing whether synthetic reasoning data teaches transferable operations rather than distribution-specific patterns.

Its central reported ordering is:

> **No training** < **Train on DP synthetic text** < **Train on the real corpus**

In other words, differentially private synthetic text can convey useful signal relative to no additional training, while still transferring less capability than the underlying real corpus.

## 4. A Unified Taxonomy

The two paradigms can be subdivided by the mechanism that produces the reasoning data. Verification applies across both columns.

<div class="reasoning-taxonomy" role="group" aria-labelledby="reasoning-taxonomy-title">
  <div class="reasoning-taxonomy-heading"><span class="reasoning-taxonomy-kicker">Generation mechanisms</span><h3 id="reasoning-taxonomy-title">Two paradigms, six data-generation strategies</h3></div>
  <div class="reasoning-taxonomy-columns">
    <section class="reasoning-taxonomy-column reasoning-taxonomy-formal" aria-labelledby="formal-taxonomy-title">
      <header class="reasoning-taxonomy-column-heading"><span class="reasoning-taxonomy-index">I</span><div><h4 id="formal-taxonomy-title">Formal / Programmatic</h4><p>Reasoning is specified or computed before natural-language realization.</p></div></header>
      <div class="reasoning-taxonomy-item"><span class="reasoning-taxonomy-code">I-A</span><div><h5>Logic-Based</h5><p>Proof trees, logical rules, and deductive inference.</p><span class="reasoning-taxonomy-examples">FLD×2 · ProofWriter · PrOntoQA</span></div></div>
      <div class="reasoning-taxonomy-item"><span class="reasoning-taxonomy-code">I-B</span><div><h5>Knowledge-Based</h5><p>Graph traversal, relational composition, and controlled dependencies.</p><span class="reasoning-taxonomy-examples">CLUTRR · KG-generated multi-hop QA</span></div></div>
      <div class="reasoning-taxonomy-item"><span class="reasoning-taxonomy-code">I-C</span><div><h5>Programmatic / Simulation-Based</h5><p>Executable calculations, state transitions, and simulation rules.</p><span class="reasoning-taxonomy-examples">GSM-Symbolic · Planning tasks</span></div></div>
    </section>
    <section class="reasoning-taxonomy-column reasoning-taxonomy-llm" aria-labelledby="llm-taxonomy-title">
      <header class="reasoning-taxonomy-column-heading"><span class="reasoning-taxonomy-index">II</span><div><h4 id="llm-taxonomy-title">LLM-Generated</h4><p>The model constructs questions, trajectories, solutions, or all three.</p></div></header>
      <div class="reasoning-taxonomy-item"><span class="reasoning-taxonomy-code">II-A</span><div><h5>Teacher Distillation</h5><p>Solutions are sampled from stronger reasoning models.</p><span class="reasoning-taxonomy-examples">OpenMathInstruct-2 · OpenThoughts3</span></div></div>
      <div class="reasoning-taxonomy-item"><span class="reasoning-taxonomy-code">II-B</span><div><h5>Knowledge-Grounded Synthesis</h5><p>Facts, documents, or seed problems become reasoning tasks.</p><span class="reasoning-taxonomy-examples">MetaMathQA · Fact-grounded QA</span></div></div>
      <div class="reasoning-taxonomy-item"><span class="reasoning-taxonomy-code">II-C</span><div><h5>Self-Generated Reasoning</h5><p>Models generate, select, and improve their own trajectories.</p><span class="reasoning-taxonomy-examples">STaR · Rejection sampling</span></div></div>
    </section>
  </div>
</div>

**Cross-cutting verification:** formal proof, execution, exact-answer matching, semantic checking, LLM judging, and human evaluation. A single pipeline may combine programmatic question generation, LLM-written explanations, and symbolic validation.

## 5. A Factual-Reasoning Example

Consider facts and a rule:

$$
\begin{aligned}
&\operatorname{Parent}(\text{Alice}, \text{Bob}) \\
&\operatorname{Parent}(\text{Bob}, \text{Charlie}) \\
&\operatorname{Parent}(x,y) \land \operatorname{Parent}(y,z) \Rightarrow \operatorname{Grandparent}(x,z)
\end{aligned}
$$

### Type I: Formal Generation

A generator samples the relation composition

$$
\mathrm{Alice} \rightarrow \mathrm{Bob} \rightarrow \mathrm{Charlie},
$$

computes the answer, and may verbalize the task:

> Alice is Bob's parent, and Bob is Charlie's parent. Who is Charlie's grandparent?

Text may vary, but the derivation is constrained by the predefined rule.

### Type II: LLM-Generated Reasoning

An LLM receives the same facts and is asked to create a multi-hop question, reasoning steps, and answer. It might create the grandparent question or another valid family-relation task. The selected reasoning operation comes from the model's generation distribution, subject to the prompt.

### A Hybrid Approach

An LLM can propose a question while a solver checks that it is answerable from available facts and rules:

$$
q \sim P_\theta(q \mid F), \qquad y = \operatorname{Solver}(F, R, q)
$$

The LLM controls task construction; the solver determines answerability and the answer. This combines contextual flexibility with explicit correctness checks, though the language must still faithfully correspond to the formal representation.

## 6. Generation Mechanisms and Learning Content Are Independent

Formal and LLM-generated data can both target logic, relational reasoning, mathematics, or belief revision.

<div class="reasoning-data-matrix" role="group" aria-labelledby="reasoning-data-matrix-title">
  <div class="reasoning-data-matrix-intro"><span class="reasoning-data-matrix-kicker">A two-axis taxonomy</span><h3 id="reasoning-data-matrix-title">What is learned × how reasoning is generated</h3></div>
  <div class="reasoning-data-matrix-axis reasoning-data-matrix-axis-top" aria-hidden="true"><span>Generation paradigm →</span></div>
  <div class="reasoning-data-matrix-grid">
    <div class="reasoning-data-matrix-corner" aria-hidden="true"><span>Learning content</span><span class="reasoning-data-matrix-arrow">↓</span></div><div class="reasoning-data-matrix-column-heading reasoning-data-matrix-formal-heading"><span class="reasoning-data-matrix-symbol" aria-hidden="true">⌘</span><span>Formal / Programmatic</span></div><div class="reasoning-data-matrix-column-heading reasoning-data-matrix-llm-heading"><span class="reasoning-data-matrix-symbol" aria-hidden="true">✦</span><span>LLM-Generated</span></div>
    <div class="reasoning-data-matrix-row-heading">Abstract Logic</div><div class="reasoning-data-matrix-cell reasoning-data-matrix-formal"><strong>FLD×2 · ProofWriter</strong><span>Proofs and controlled deduction</span></div><div class="reasoning-data-matrix-cell reasoning-data-matrix-llm"><strong>Logic puzzles</strong><span>Generated tasks and trajectories</span></div>
    <div class="reasoning-data-matrix-row-heading">Relational Reasoning</div><div class="reasoning-data-matrix-cell reasoning-data-matrix-formal"><strong>CLUTRR · KG paths</strong><span>Relations and graph traversal</span></div><div class="reasoning-data-matrix-cell reasoning-data-matrix-llm"><strong>Fact-to-question synthesis</strong><span>Document- and fact-grounded QA</span></div>
    <div class="reasoning-data-matrix-row-heading">Mathematics</div><div class="reasoning-data-matrix-cell reasoning-data-matrix-formal"><strong>GSM-Symbolic</strong><span>Programmatic variable changes</span></div><div class="reasoning-data-matrix-cell reasoning-data-matrix-llm"><strong>OpenMathInstruct-2 · MetaMathQA</strong><span>Teacher-generated augmentation</span></div>
    <div class="reasoning-data-matrix-row-heading">Belief Revision</div><div class="reasoning-data-matrix-cell reasoning-data-matrix-formal"><strong>Revision operators</strong><span>Controlled state transitions</span></div><div class="reasoning-data-matrix-cell reasoning-data-matrix-llm"><strong>Changing-evidence scenarios</strong><span>Generated contextual variation</span></div>
  </div>
  <div class="reasoning-data-matrix-legend" aria-label="Matrix legend"><span><i class="reasoning-data-matrix-swatch reasoning-data-matrix-swatch-formal" aria-hidden="true"></i>Reasoning defined before text generation</span><span><i class="reasoning-data-matrix-swatch reasoning-data-matrix-swatch-llm" aria-hidden="true"></i>Reasoning constructed during model generation</span></div>
</div>

## 7. What Does Synthetic Reasoning Data Teach?

Training content does not necessarily determine the computation learned by a model. Three learning effects are worth separating.

### Learning Reasoning Operations

Formal datasets can directly supervise implication, relational composition, or state updates:

$$
(F, R) \mapsto y
$$

They enable precise control over operations, but strong performance does not prove that the intended algorithm was learned; a model may exploit regularities in the synthetic distribution.

### Learning Reasoning Trajectories

Teacher-generated traces provide examples of problem decomposition and solution:

$$
P_\theta(r, y \mid x)
$$

They can transfer patterns a smaller model would not produce alone, but may primarily transfer a teacher's solution distribution rather than an independently generalizable mechanism.

### Learning to Adapt to Changing Contexts

Data can also teach a model to organize and revise reasoning as information changes: which facts matter, whether an earlier conclusion remains supported, and whether new evidence requires local modification or broader recomputation. This is particularly relevant to belief revision and non-monotonic reasoning.

## 8. Diversity, Verification, and Generalization

Reasoning diversity is not exclusive to LLM-generated data. A formal generator can vary rule combinations, proof depths, entities, and distractors; an LLM can generate many linguistic variants of nearly identical reasoning patterns.

- **Structural diversity:** reasoning graphs, inference rules, and computational operations.
- **Semantic diversity:** entities, factual domains, and situations.
- **Linguistic diversity:** alternative expressions of equivalent problems or steps.

Surface variation is not necessarily meaningful reasoning variation. Stronger verification does not automatically improve generalization either: a verifier may check only final answers, and strict filtering may remove unusual but valid solutions. Reliability, diversity, and downstream generalization are empirical properties of a pipeline, not consequences of its label.

ContinuousBench makes this issue concrete: synthetic text can be fluent and internally consistent without transferring useful new knowledge or capability. For synthetic reasoning data, an analogous evaluation should vary unseen predicates, entities, rule compositions, and natural-language realizations—not only templates or surface wording.

### Note: Researchers to Follow

- **Gautam Kamath** (NYU Courant; Vector Institute) studies the reliability of synthetic data from a theoretical perspective: whether generated data transfers genuinely new knowledge or capabilities, and how privacy, robustness, and data poisoning affect that transfer.
- **Shubham Toshniwal** (Databricks Mosaic AI) studies synthetic data for reasoning training, including teacher-generated mathematical supervision, data filtering and selection, reinforcement learning, and agentic reasoning. His work on OpenMathInstruct-2 and KARL is especially relevant to synthetic reasoning pipelines.

