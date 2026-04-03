---
layout: distill
title: 'NMR - Defeasible Logic'
description: Nonmonotonic Reasoning
gradient: linear-gradient(135deg, #0064e1 0%, #5bd3ff 100%)
hover-gradient: linear-gradient(135deg, #00c6fb 0%, #005bea 100%)
background_color: rgb(187, 255, 92)
date: 2025-09-04
---

## Why Defeasible Logic? (Motivation and Scope)

Classical (monotonic) logic assumes that once a conclusion is derived it can never be invalidated by adding more information. Real-world reasoning violates this assumption constantly: rules admit **exceptions**, evidence is **incomplete**, and priorities between rules (e.g., statutory vs. case law; general vs. specific medical heuristics) matter. **Defeasible Logic (DL)** is a family of non-monotonic formalisms engineered to reason with such *retractable* knowledge while keeping inference **transparent, explainable, and computationally manageable**.

- **Knowledge with exceptions.** “Birds fly” is informative yet false for penguins, injured birds, heavy-laden birds, etc. We want to *use* the default unless there is a counter-reason.
- **Dynamic evidence.** New information (e.g., “this bird is a penguin”) must be able to *defeat* earlier tentative conclusions (“it flies”).
- **Competing sources.** A more specific or higher-priority rule should overrule a general or lower-priority one.
- **Explainability.** Stakeholders (lawyers, clinicians, auditors) need *arguments*: explicit, minimal sets of premises/rules that justify a conclusion and can be compared, attacked, and defended.

Crucially, *retractability is not mere choice.* Having two options (“yes/no”) and *committing* to one is different from **adopting a tentative conclusion that may later be withdrawn** upon encountering defeating information. DL makes this retractability first-class.

---

## Core Language and Knowledge Base

Let $\mathsf{At}$ be a set of ground atoms. A **literal** is either $p \in \mathsf{At}$ or its negation $\neg p$.

- **Facts.** A set $\mathsf{F}$ of literals (immutable truths).
- **Strict rules.** $\;L_0 \leftarrow L_1,\dots,L_n$  
  (Whenever $L_1,\dots,L_n$ hold, $L_0$ must hold.)
- **Defeasible rules.** $\;L_0 \;-\!<\; L_1,\dots,L_n$  
  (Typically, if $L_1,\dots,L_n$ hold and nothing defeats the rule, infer $L_0$.)
- **Defeaters (optional).** $\;\;\sim\! L_0 \;-\!<\; L_1,\dots,L_n$  
  (Used to *block* conclusions without supporting the opposite.)
- **Priorities (optional).** A binary acyclic relation $\succ$ over rules, where $r_1 \succ r_2$ means “$r_1$ overrides $r_2$” when they conflict (e.g., *specificity* or *authority*).

A **knowledge base** is $KB=(\mathsf{F},\mathsf{S},\mathsf{D},\mathsf{Def},\succ)$ for facts, strict rules, defeasible rules, defeaters, and a (possibly empty) priority relation.

---

## Proof-Theoretic Intuition (Tagged Derivability)

A convenient DL presentation distinguishes *definitive* vs *defeasible* provability with tags (one common style):

- $+\!\Delta L$ : $L$ is definitely provable (from facts $+$ strict rules).
- $-\!\Delta L$ : $L$ is definitely not provable.
- $+\!\partial L$ : $L$ is defeasibly provable (there is a supporting chain of defeasible/strict rules and all counter-arguments are defeated).
- $-\!\partial L$ : $L$ is not defeasibly provable (every attempt is blocked by a strictly undefeated counter-argument).

Sketch:
1. **Definitive layer:** close under $\leftarrow$ using $\mathsf{F}\cup\mathsf{S}$ to compute what is indisputable.
2. **Defeasible layer:** tentatively apply $-\!<$ rules when their premises are (definitely or defeasibly) available *and* no *undefeated* counter-derivation exists for $\neg L$ (considering $\succ$).

This two-tier view makes explicit why **strictly derivable** conclusions need *no* argument: they are not tentative.

---

## Arguments: The Unit of Justification and Debate

An **argument** is a compact, defensible justification for a tentative conclusion.

**Definition (Argument).**  
An argument is a pair $\langle A, h \rangle$ such that:

1. (**Support**) $h \in \mathsf{Cn}(A \cup \mathsf{S} \cup \mathsf{F})$ where $A \subseteq \mathsf{D}$ (and optionally $\mathsf{Def}$) and $\mathsf{Cn}$ is the closure under the proof theory.
2. (**Non-triviality**) $A \cup \mathsf{S} \cup \mathsf{F}$ is consistent.
3. (**Minimality**) For every strict subset $A' \subsetneq A$, $h \notin \mathsf{Cn}(A' \cup \mathsf{S} \cup \mathsf{F})$.
4. (**Strict non-derivability**) $h \notin \mathsf{Cn}(\mathsf{S} \cup \mathsf{F})$ (otherwise $h$ is definitive, not defeasible).

Intuition: an argument is the **minimal set of defeasible commitments** that, together with indisputable knowledge, suffices to conclude $h$.

---

## Attacks and Defeats (How Arguments Interact)

Let $\mathcal{A}=\langle A,h\rangle$ and $\mathcal{B}=\langle B,k\rangle$ be arguments.

- **Rebuttal:** $\mathcal{B}$ *rebuts* $\mathcal{A}$ if $k$ is (logically equivalent to) $\neg h$.
- **Undercut:** $\mathcal{B}$ *undercuts* $\mathcal{A}$ if it attacks the *applicability* of some rule in $A$ (e.g., a premise/exceptions literal is shown to fail).
- **Undermine:** $\mathcal{B}$ *undermines* a **premise** of $\mathcal{A}$ (e.g., attacks a non-strict premise literal used by $A$).

A **defeat** is an attack that *survives* priority comparison: $\mathcal{B}$ **defeats** $\mathcal{A}$ if it attacks $\mathcal{A}$ and there is no rule in $A$ that (by $\succ$ or specificity) overrides the attack. Formally, for rebuttals,
$$
\text{Defeat}(\mathcal{B},\mathcal{A}) \iff 
\big(k \equiv \neg h\big)\;\wedge\;
\neg\exists\, r_A\in A, r_B\in B\; \text{with}\; r_A \succ r_B.
$$
(Analogous conditions are stated for undercuts/undermines.)

---

## Dialectical Evaluation (Which Conclusions Survive?)

Arguments form a **graph** whose nodes are arguments and edges are defeats. Two standard evaluation modes:

- **Credulous acceptance:** $h$ is accepted if there exists at least one *admissible* (self-defending) set of arguments supporting $h$.
- **Skeptical acceptance:** $h$ is accepted only if it appears in *all* acceptable (e.g., grounded/preferred) extensions.

Using Dung-style semantics, compute extensions (grounded, preferred, stable) of the defeat graph; the *accepted* literals are those supported by arguments in the chosen extension(s). In DeLP-style dialectics, one builds a **dialectical tree**: the root is $\langle A,h\rangle$; children are its defeaters; grandchildren are counter-defeaters; the **warranted** status of $h$ is obtained by a bottom-up marking (defeater defeated ⇒ parent justified).

---

## Why Defeasible Logic *Needs* Arguments

1. **Conflict management.** When defaults collide (e.g., “birds fly” vs. “penguins do not fly”), *arguments* let us compare the *justifications* rather than raw rule sets, enabling fine-grained defeat via rebut/undercut/priority.
2. **Explainability and accountability.** Each accepted conclusion comes with a minimal, human-auditable proof object $\langle A,h\rangle$ explaining *why* it holds and *what* would defeat it.
3. **Modularity.** Arguments localize reasoning: we can refine or retract specific defeasible rules in $A$ without recomputing the entire closure.
4. **Alignment with human reasoning.** Legal, medical, and ethical deliberations naturally proceed via **claims + supporting reasons + counter-reasons**. DL with arguments is a faithful, formal counterpart.

---

## Worked Example (Specificity and Defeat)

Let
- $\mathsf{F}=\{\textit{bird}(t), \textit{penguin}(t)\}$ and $\mathsf{S}=\{\textit{penguin}(x)\leftarrow \textit{bird}(x)\}$ (or the reverse, as needed).
- Defeasible rules:
  $$
  r_1:\; \textit{flies}(x)\;-\!<\;\textit{bird}(x) \quad\quad
  r_2:\; \neg\textit{flies}(x)\;-\!<\;\textit{penguin}(x)
  $$
Assume **specificity** gives $r_2 \succ r_1$.

- Argument $\mathcal{A}=\langle \{r_1\}, \textit{flies}(t)\rangle$ is supported by $\textit{bird}(t)$.
- Argument $\mathcal{B}=\langle \{r_2\}, \neg\textit{flies}(t)\rangle$ is supported by $\textit{penguin}(t)$.
- $\mathcal{B}$ **rebuts** $\mathcal{A}$, and since $r_2 \succ r_1$, $\mathcal{B}$ **defeats** $\mathcal{A}$.
- Skeptically, we accept $\neg\textit{flies}(t)$; credulously, we might still accept $\textit{flies}(t)$ only if $\mathcal{A}$ remains undefeated in some extension (it doesn’t here).

Add an **undercutter**:
$$
r_3:\; \neg\textit{flies}(x)\;-\!<\;\textit{injured}(x).
$$
If later $\textit{injured}(t)$ becomes known, a new argument undercuts any rule concluding $\textit{flies}(t)$, even outside the penguin case.

---

## Design Degrees of Freedom (and Why They Matter)

- **Priorities $\succ$** (statute > guideline; specific > general; recent > old; trusted > untrusted).
- **Ambiguity propagation vs. blocking.** Should a tie between conflicting arguments *block* both conclusions, or allow both to persist credulously?
- **Defeaters** vs. **full rebuttals.** Some knowledge should only *prevent* a conclusion without entailing its negation.
- **Skeptical vs. credulous acceptance.** Safety-critical applications often prefer skeptical acceptance; exploratory reasoning may use credulous acceptance to surface possibilities.

These are not mere stylistic choices; they determine whether reasoning is **cautious**, **adventurous**, or **balanced**, and they directly impact *which* arguments become warranted.

---

## Formal Summary (Ready-to-Cite Statements)

- **Strict vs. Defeasible Inference.**
  $$
  \frac{L_1,\dots,L_n \quad (L_0 \leftarrow L_1,\dots,L_n)\in \mathsf{S}}{+\!\Delta L_0}
  \qquad
  \frac{L_1,\dots,L_n \quad (L_0 -\!< L_1,\dots,L_n)\in \mathsf{D}\quad \text{No undefeated counter}}{+\!\partial L_0}
  $$

- **Argument (Minimal, Consistent, Strict-Non-Derivable).**  
  $$
  \text{Arg}(A,h) \iff 
  \begin{cases}
  h \in \mathsf{Cn}(A \cup \mathsf{S} \cup \mathsf{F}),\\
  A \cup \mathsf{S} \cup \mathsf{F}\ \text{consistent},\\
  \forall A' \subsetneq A:\; h \notin \mathsf{Cn}(A' \cup \mathsf{S} \cup \mathsf{F}),\\
  h \notin \mathsf{Cn}(\mathsf{S} \cup \mathsf{F}).
  \end{cases}
  $$

- **Defeat via Priority.**  
  If $\mathcal{B}$ attacks $\mathcal{A}$ and $\nexists r_A\in A, r_B\in B$ with $r_A \succ r_B$, then $\mathcal{B}$ defeats $\mathcal{A}$.

- **Acceptance.**  
  $h$ is **skeptically accepted** iff for all acceptable extensions $E$, there exists $\langle A,h\rangle \in E$; **credulously accepted** iff there exists at least one acceptable extension $E$ with $\langle A,h\rangle \in E$.

---

## Takeaway

Defeasible Logic captures the **tentative, revisable** nature of practical reasoning. **Arguments** are the core explanatory artifact: minimal, consistent packages of defeasible commitments that **justify** conclusions, **expose** where they can be defeated, and **support** principled acceptance under dialectical evaluation. This pairing (DL + arguments) yields systems that are not only robust to exceptions and new evidence, but also *auditable* and *aligned with human reasoning*.



Allaway, Evaluating Defeasible Reasoning in LLMs with DEFREASING, 2025 