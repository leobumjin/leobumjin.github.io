---
layout: distill-reading
language: English
category: Logic
media: Study
bibliography: all.bib
giscus_comments: false
disqus_comments: false
date: 2025-03-08
featured: true
title: 'NMR Classes'
description: 'What are the basic principles for developing logic.'
_styles: >
    .table {
        padding-top:200px;
        margin-bottom: 2.5rem;
        border-bottom: 2px;
    }
    .p {
        font-size:20px;
    }

---

## Non-monotonic Reasoning Classes

> **No statement is immune to revision.**    
> W. V. O. Quine, Two Dogmas of Empiricism (1951)

Much of human knowledge can be expressed in the form of rules. From observations of the world, we derive statements such as “if this holds, then that follows.” However, these rules are rarely complete or absolute. When new observations are introduced or previously unseen conditions are revealed, conclusions that once seemed valid can easily change.

By applying multiple rules in sequence, we can infer new facts. At the same time, exceptions naturally arise. A rule that works well in one situation may lead to a different conclusion when combined with another rule or additional information. As a result, conflicts are not anomalies but a natural consequence of rule-based reasoning.

Therefore, knowledge conflict should be understood as an inherent property of reasoning under incomplete rules. The key question is not whether conflicts occur, but when and under what conditions they arise, and how they can be handled. Analyzing the structure of such conflicts provides a crucial foundation for understanding complex reasoning processes and for designing more robust reasoning systems.


> X is a melon. ($\ell_1$)  
> X is a watermelon. ($\ell_2$)  
> Watermelon is a melon. ($ R_1: \ell_2 \rightarrow \ell_1$)    
> Melons are usually light green inside. ($R_2 : \ell_1 \rightarrow \ell_3$)    
> Watermelons are not green inside. ($\neg \ell_3$)  
> Whether green or not green, a polarity conflict arises. ($\ell_3 \lor \neg \ell_3$)

When more rules and initial facts are given, we can consider the following reasoning paths:

<div style="text-align: center; background: white; padding: 20px; border-radius: 20px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); margin: 30px 0;">
  <video id="nmr-video" width="100%" height="auto" loop muted playsinline autoplay style="border-radius: 12px; display: block;">
    <source src="https://d2acbkrrljl37x.cloudfront.net/research/thesis/nmr_classes/main.mp4" type="video/mp4">
    Your browser does not support the video tag.
  </video>
</div>

We analyze types of reasoning paths between **a start atom** $a_0$ and **an end atom** $a_e$.

## Basic Relation Types 

Consider  **a start atom** $a_0$ and **an end atom** $a_e$. 
There are four types of two-hop reasoning paths:
* $a_0 \rightarrow a_e$ : Positive to Positive
* $a_0 \rightarrow \neg a_e$ : Positive to Negative
* $\neg a_0 \rightarrow a_e$ : Negative to Positive
* $\neg a_0 \rightarrow \neg a_e$ : Negative to Negative 

<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin: 30px 0;">
  <div style="text-align: center; background: white; padding: 20px; border-radius: 20px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); transition: transform 0.3s ease, box-shadow 0.3s ease;">
    <p style="margin-bottom: 15px; font-weight: 600; font-size: 18px; color: #333;">Positive to Positive</p>
    <img src="https://d2acbkrrljl37x.cloudfront.net/research/thesis/nmr_classes/1_simple_pp.png" width="100%" height="auto" style="border-radius: 12px;" />
  </div>
  <div style="text-align: center; background: white; padding: 20px; border-radius: 20px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); transition: transform 0.3s ease, box-shadow 0.3s ease;">
    <p style="margin-bottom: 15px; font-weight: 600; font-size: 18px; color: #333;">Negative to Negative</p>
    <img src="https://d2acbkrrljl37x.cloudfront.net/research/thesis/nmr_classes/1_simple_nn.png" width="100%" height="auto" style="border-radius: 12px;" />
  </div>
  <div style="text-align: center; background: white; padding: 20px; border-radius: 20px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); transition: transform 0.3s ease, box-shadow 0.3s ease;">
    <p style="margin-bottom: 15px; font-weight: 600; font-size: 18px; color: #333;">Positive to Negative</p>
    <img src="https://d2acbkrrljl37x.cloudfront.net/research/thesis/nmr_classes/1_simple_pn.png" width="100%" height="auto" style="border-radius: 12px;" />
  </div>
  <div style="text-align: center; background: white; padding: 20px; border-radius: 20px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); transition: transform 0.3s ease, box-shadow 0.3s ease;">
    <p style="margin-bottom: 15px; font-weight: 600; font-size: 18px; color: #333;">Negative to Positive</p>
    <img src="https://d2acbkrrljl37x.cloudfront.net/research/thesis/nmr_classes/1_simple_np.png" width="100%" height="auto" style="border-radius: 12px;" />
  </div>
</div>

* When **contraposition** $(a \rightarrow b) \;\leftrightarrow\; (\neg b \rightarrow \neg a)$ is assumed to hold, the rule set expands to eight distinct rules.


---

# Types of Logical Structure

We say that a graph $G$ forms a logical structure if it includes all nodes
and edges that are derivable from the given rule set.
In this sense, each logical structure corresponds to a connected component
induced by the rules.

## Type: Simple  

A reasoning structure $G$ is said to be simple if it takes the form of a single
linear chain of literals
$$
(\ell_0, \ell_1, \ldots, \ell_e),
$$
representing a sequence of derivations from an initial literal $\ell_0$
to a terminal literal $\ell_e$.



<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0; align-items: center;">
  <div style="text-align: center; background: white; padding: 20px; border-radius: 20px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);">
    <video id="nmr-video" width="100%" height="auto" loop muted playsinline autoplay style="border-radius: 12px; display: block;">
      <source src="https://d2acbkrrljl37x.cloudfront.net/research/thesis/nmr_classes/1_simple.mp4" type="video/mp4">
      Your browser does not support the video tag.
    </video>
  </div>
  <div style="padding: 20px;">
    <h3 style="margin-top: 0; font-weight: 600; font-size: 20px; color: #333;">Simple Reasoning</h3>
    <p style="line-height: 1.6; color: #555;">$(\ell_0, \ell_1, \ldots, \ell_e)$</p>
  </div>
</div>
A chain of multiple rules forms a simple structure when none of its nodes has external incoming edges.
<div style="text-align: center; background: white; padding: 20px; border-radius: 20px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); margin: 20px 0;">
  <video id="nmr-video" width="100%" height="auto" loop muted playsinline autoplay style="border-radius: 12px; display: block;">
    <source src="https://d2acbkrrljl37x.cloudfront.net/research/thesis/nmr_classes/3_simple_reasoning.mp4" type="video/mp4">
    Your browser does not support the video tag.
  </video>
</div>


**Abstractable Reasoning Path.**   
A reasoning path
$$
\tau = (\ell_1, \ell_2, \ldots, \ell_k)
$$
is said to be abstractable if the direct implication
$$
\ell_1 \rightarrow \ell_k
$$
is derivable under the rule set.
That is, the multi-hop path can be collapsed into a single-step rule
without loss of logical support.

**Abstractable Logical Structure.**    
A reasoning structure $G$ is said to be abstractable if every reasoning path
contained in $G$ is abstractable.
Equivalently, for any two literals $\ell_i$ and $\ell_j$ in $G$ such that
there exists a path from $\ell_i$ to $\ell_j$, the implication
$$
\ell_i \rightarrow \ell_j
$$
is derivable.


## Type: Support
A logical structure may contain multiple reasoning paths leading to the same
ending node.
We say that an ending node is supported by a logical structure if all reasoning
paths terminating at that node induce a single polarity—either positive or
negative.

Formally, an atom $a \in G$ is said to be supported if

$$
\left|\left\{ \mathrm{Pol}(\tau) \;\middle|\; \tau \in \prod(G),
\ \mathrm{Atom}(\tau_{-1}) = a \right\}\right| = 1.
$$

That is, all reasoning paths whose terminal literal corresponds to atom $a$
agree on the same polarity.

Note that support is defined at the atom level.
We do not say that a node is supported simply because a positive (or negative)
literal is derivable, but only when the derivations yield a unique polarity.



<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0; align-items: center;">
  <div style="text-align: center; background: white; padding: 20px; border-radius: 20px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);">
    <video id="nmr-video" width="100%" height="auto" loop muted playsinline autoplay style="border-radius: 12px; display: block;">
      <source src="https://d2acbkrrljl37x.cloudfront.net/research/thesis/nmr_classes/2_simple_support.mp4" type="video/mp4">
      Your browser does not support the video tag.
    </video>
  </div>
  <div style="padding: 20px;">
    <h3 style="margin-top: 0; font-weight: 600; font-size: 20px; color: #333;">Support</h3>
    <p style="line-height: 1.6; color: #555;">Single Polarity <br> Either Positive or Negative </p>
  </div>
</div>

Even though there are multiple reasoning paths, a unique polarity can be obtained when all rules yield the same polarity.
<div style="text-align: center; background: white; padding: 20px; border-radius: 20px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); margin: 20px 0;">
  <video id="nmr-video" width="100%" height="auto" loop muted playsinline autoplay style="border-radius: 12px; display: block;">
    <source src="https://d2acbkrrljl37x.cloudfront.net/research/thesis/nmr_classes/4_support_reasoning.mp4" type="video/mp4">
    Your browser does not support the video tag.
  </video>
</div>


* [**Supported -> Abstractable**] When $G$ includes only supported atoms, all paths in $G$ can be abstracted. That is, $G$ is an **abstractable logical structure**. 

## Conflict 

**Conflicting Logical Structure.**  
Given a logical structure $G$, if there exists an atom $a$ such that
$$
G \Vdash a \quad \text{and} \quad G \Vdash \neg a,
$$
we say that $a$ is a conflicting atom in $G$.
In this case, $G$ is said to contain a conflict.

From the perspective of rules, this means that the rules yield conflicting
conclusions.
Specifically, consider two rules
$R_1 : \ell_1 \rightarrow \ell$ and
$R_2 : \ell_2 \rightarrow \neg \ell$.

<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0; align-items: center;">
  <div style="text-align: center; background: white; padding: 20px; border-radius: 20px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);">
    <video id="nmr-video" width="100%" height="auto" loop muted playsinline autoplay style="border-radius: 12px; display: block;">
      <source src="https://d2acbkrrljl37x.cloudfront.net/research/thesis/nmr_classes/5_simple_conflict.mp4" type="video/mp4">
      Your browser does not support the video tag.
    </video>
  </div>
  <div style="padding: 20px;">
    <h3 style="margin-top: 0; font-weight: 600; font-size: 20px; color: #333;">Conflict</h3>
    <p style="line-height: 1.6; color: #555;">Both positive and negative polarity exist for an atom.</p>
  </div>
</div>

<div style="text-align: center; background: white; padding: 20px; border-radius: 20px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); margin: 20px 0;">
  <video id="nmr-video" width="100%" height="auto" loop muted playsinline autoplay style="border-radius: 12px; display: block;">
    <source src="https://d2acbkrrljl37x.cloudfront.net/research/thesis/nmr_classes/6_conflict_reasoning.mp4" type="video/mp4">
    Your browser does not support the video tag.
  </video>
</div>

* Although a logical structure $G$ contains conflicting atoms, $G$ remains abstractable when all premise atoms are used once.

## Multi-Paths Conflict

A head node may have multiple outgoing edges, giving rise to multiple reasoning paths.


<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0; align-items: center;">
  <div style="text-align: center; background: white; padding: 20px; border-radius: 20px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);">
    <video id="nmr-video" width="100%" height="auto" loop muted playsinline autoplay style="border-radius: 12px; display: block;">
      <source src="https://d2acbkrrljl37x.cloudfront.net/research/thesis/nmr_classes/7_multipaths_simple.mp4" type="video/mp4">
      Your browser does not support the video tag.
    </video>
  </div>
  <div style="padding: 20px;">
    <h3 style="margin-top: 0; font-weight: 600; font-size: 20px; color: #333;">Multi-Paths</h3>
    <p style="line-height: 1.6; color: #555;">This demonstrates reasoning with multiple paths and complex interactions.</p>
  </div>
</div>

### Multi-Paths Conflict Abstractable

A multi-paths conflict is said to be abstractable when a head node has
multiple outgoing edges and a tail node has multiple incoming edges in a
graph $G$, yet the resulting polarity remains uniquely determined.

Although such a structure may appear non-abstractable due to branching,
if all reasoning paths originate from a single polarity at the head node,
the outputs can still be uniquely determined.
We therefore refer to this case as a multi-paths conflict abstractable.


<div style="text-align: center; background: white; padding: 20px; border-radius: 20px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); margin: 20px 0;">
  <video id="nmr-video" width="100%" height="auto" loop muted playsinline autoplay style="border-radius: 12px; display: block;">
    <source src="https://d2acbkrrljl37x.cloudfront.net/research/thesis/nmr_classes/8_multipaths_support.mp4" type="video/mp4">
    Your browser does not support the video tag.
  </video>
</div>

### Multi-Paths Conflict Non-Abstractable

A multi-paths conflict is non-abstractable when multiple reasoning paths
from a head node to a tail node induce different polarities, even when
starting from the same premise polarity.

In this case, no unique abstraction from the head node to the tail node
can be derived, and the reasoning structure is not abstractable.


<div style="text-align: center; background: white; padding: 20px; border-radius: 20px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); margin: 20px 0;">
  <video id="nmr-video" width="100%" height="auto" loop muted playsinline autoplay style="border-radius: 12px; display: block;">
    <source src="https://d2acbkrrljl37x.cloudfront.net/research/thesis/nmr_classes/9_multipaths_conflict_reasoning.mp4" type="video/mp4">
    Your browser does not support the video tag.
  </video>
</div>



---

# Formalization 
We begin by defining the basic symbolic units used throughout this work.

**Atoms.**  
Let $$\mathcal{A}$$ be a finite set of atoms.
An atom $a \in \mathcal{A}$ represents an indivisible propositional symbol
without intrinsic truth value.

**Literals.**   
For each atom $a \in \mathcal{A}$, we define two literals corresponding to its polarity:
- $a$   : the positive literal
- $\neg a$ : the negative literal

We denote the set of all literals by
$$
\mathcal{L} = \{ a, \neg a \mid a \in \mathcal{A} \}.
$$
Each literal $\ell \in \mathcal{L}$ has an associated polarity,
either positive or negative.

**Rules.**  
A rule is defined as a directed implication between two literals.
Formally, a rule $R$ is written as:
$$
R : \ell_1 \rightarrow \ell_2
$$
where $\ell_1, \ell_2 \in \mathcal{L}$.
A rule represents a deterministic transition stating that
if $\ell_1$ holds, then $\ell_2$ is supported.

**Logical Structure**   
A logical structure $G = (\mathcal{A}, \mathcal{R}, v_0)$ consists of a set of atoms
$\mathcal{A}$, a set of rules $\mathcal{R}$ defined over these atoms, and an
initial interpretation function
$$
v_0 : \mathcal{A} \rightarrow \{\mathsf{t}, \mathsf{f}, \mathsf{u}\},
$$
which assigns truth values to atoms \emph{only at the initial state}, prior to any
rule application.


**Reasoning Path**      
A reasoning path $\tau \in \prod(G)$ is defined as a finite sequence of literals
$$
\tau = (\ell_0, \ell_1, \dots, \ell_k),
$$
where $\ell_i \in \mathcal{L}$ and $(\ell_i \rightarrow \ell_{i+1}) \in \mathcal{R}$
for all $i$.
Here, $\prod(G)$ denotes the set of all literal sequences that can be generated
solely by repeated application of rules in $\mathcal{R}$.


**Entailment**   
We write
$$
G \models_{\prod(G)} \ell
$$
to denote that the literal $\ell$ is derivable from the initial valuation $v_0$
by following at least one valid reasoning path in $\prod(G)$. When the context is clear, we omit the subscript $\prod(G)$ and write $\models$
for simplicity.


|   Name   |     Definition    | 
|----------|-------------------|
|Abstractable | $\forall \tau \in \prod(G),\; (\tau_0, \tau_{-1}) \in \prod (G) \wedge (\tau_0, \neg \tau_{-1}) \notin \prod (G).$ 
| Supported |  $\forall c \in \mathcal{A},\; G \models c \;\wedge\; G \not\models \neg c.$ |
| Conflicting | $\exists c \in \mathcal{A},\; G \models c \;\wedge\; G \models \neg c.$ | 
| Multi-Paths Conflict Abstractable | $\forall c \in \mathcal{A} \text{ such that } G \models c \wedge G \models \neg c,\; $<br>$ \forall \ell_s \in \mathcal{L},\; \big( (\ell_s, c) \in \prod(G) \Rightarrow (\ell_s, \neg c) \notin \prod(G) $<br>$ \wedge (\ell_s, \neg c) \in \prod(G) \Rightarrow (\ell_s, c) \notin \prod(G) \big).$
| Multi-Paths Conflict Non-Abstractable | $\exists c \in \mathcal{A},\; \exists \ell_s \in \mathcal{L} \text{ such that }$ <br> $ (\ell_s, c) \in \prod(G) \;\wedge\; (\ell_s, \neg c) \in \prod(G). $.



---

## Need To Be Organized


**Datasets.**  
A dataset $\mathcal{D} = (\mathcal{A}, \mathcal{R}, \mathcal{V})$ consists of:

1) A partial assignment of truth values to atoms, denoted by $\mathcal{V}$.
2) A finite set of rules
$$
\mathcal{R} \subseteq \mathcal{L} \times \mathcal{L}.
$$

**Valuation.**  
The valuation $\mathcal{V}$ specifies polarity for a subset of atoms
$$\mathcal{A}_{\mathrm{given}} \subseteq \mathcal{A}$$.
For each $$a \in \mathcal{A}_{\mathrm{given}}$$, exactly one of the literals
$a$ or $\neg a$ is marked as true.
Atoms not in $$\mathcal{A}_{\mathrm{given}}$$ remain unassigned.

Thus, the given data provides a partial grounding of atoms,
from which literal truth values are induced via polarity.

**Inference Objective.**  
Given a dataset
$$
\mathcal{D} = (\mathcal{A}, \mathcal{R}, \mathcal{V}),
$$
the goal is to infer the set of all literals that can be derived as true
by repeatedly applying rules in $\mathcal{R}$ starting from $\mathcal{V}$.

Formally, inference proceeds by closure:
- Initialize the set of true literals with those induced by $\mathcal{V}$.
- Iteratively add $\ell_2$ whenever there exists a rule
  $\ell_1 \rightarrow \ell_2$ such that $\ell_1$ is true.
- Continue until a fixed point is reached.

The resulting set is the logical closure of $\mathcal{V}$ under $\mathcal{R}$,
representing the maximal set of supported literals.

**Training Data.**  
The training data consists of a restricted subset of logically valid
reasoning instances induced by $\mathcal{R}$ and the closure of
$\mathcal{D}$.
Rather than including all possible logical consequences, the training set
covers:
- All one-hop inferences induced directly by the rule set, and
- A selected subset of multi-hop reasoning chains sampled from the logical closure.

Formally, each training instance corresponds to either:
1) A single-step inference $\ell_1 \rightarrow \ell_2 \in \mathcal{R}$, or
2) A finite reasoning chain
$$
(\ell_1, \ell_2, \dots, \ell_k)
$$
where $\ell_i \rightarrow \ell_{i+1} \in \mathcal{R}$ for all $i$,
and $(\ell_1, \dots, \ell_k)$ is a subsequence of the full logical closure.

This design ensures that the training data exposes the model to valid local
transitions and limited compositional reasoning, without revealing the
entire closure.

**Test Data.**  
The test data consists of the remaining logical consequences in the closure
of $\mathcal{D}$ that are not observed during training.
In particular, test instances emphasize multi-hop reasoning beyond direct
rule application.

Concretely, reasoning chains of depth two or greater are split across
training and test sets, such that:
- One-hop consequences are always included in training, and
- Deeper reasoning chains are evaluated in the test set unless explicitly
  sampled for training.

This split evaluates the model’s ability to generalize beyond observed
local transitions to unseen compositional inferences.

**Contraposition Test Data.**  
In addition, we define a contraposition test set by augmenting the rule set
with contraposed rules.
For each rule $\ell_1 \rightarrow \ell_2 \in \mathcal{R}$,
its contraposition
$$
\neg \ell_2 \rightarrow \neg \ell_1
$$
is considered during evaluation.

The contraposition test evaluates whether a model can correctly reason
over implications not explicitly present in $\mathcal{R}$,
but logically entailed under classical contraposition.

---

**Verfication of Reasoning Ability** 
- Abstraction: Learns with multi-hop sequences and try infer the default reasoning 
  - Train: samples of length > 2
  - Test: samples of length = 2
- Rule Generalization
  - Train: hop-2 sequences 
  - Test: True and False evaluation of length N >= sequences. 
- Contraposition Generalization
  - Train: hop-2 sequences
  - Test: sequence with contraposition 

**Toy Model & LLI (Logical Language Inference)** 
- Toy Model: Learn a sequence and test with in-distribution samples.  
- LLI: Learn the distribution of facts (by any formats) and generalize for general formats.   
  - Parameter Tuning Free: Give knowledge by prompts optionally including in-context examples, and provide a valid query. 
  - Parameter Tuning : 



<style>
  div[style*="grid-template-columns"] > div:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15) !important;
  }
</style>





<script>
  (function() {
    var video = document.getElementById('nmr-video');
    if (video) {
      video.muted = true;
      video.play().catch(function(error) {
        // If autoplay fails, try again after user interaction
        document.addEventListener('click', function() {
          video.play();
        }, { once: true });
      });
      
      // Ensure video loops
      video.addEventListener('ended', function() {
        video.currentTime = 0;
        video.play();
      });
    }
  })();
</script>
