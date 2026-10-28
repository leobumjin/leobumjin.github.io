---
layout: post
title: "Conflict-Driven Clause Learning: Reasoning Through Failure"
permalink: /blog/2026/cdcl-reasoning-through-failure-en/
mini-title: "Reasoning Through Failure"
---

Deep reasoning is not simply about thinking longer or exploring more possibilities. It is also about learning from failed reasoning and using that knowledge to guide future decisions.

Conflict-Driven Clause Learning (CDCL), a foundational algorithm in modern SAT solvers, illustrates this principle. Rather than searching blindly through possible solutions, CDCL makes logical assumptions, derives their consequences, and detects contradictions. When a conflict occurs, the algorithm analyzes its causes and learns a new logical constraint, called a clause, that prevents similar failures from recurring.

The core conflict-analysis and learning mechanisms of CDCL appeared in the GRASP solver by João P. Marques-Silva and Karem A. Sakallah in **1996**. A **2001** paper by Lintao Zhang, Conor F. Madigan, Matthew H. Moskewicz, and Sharad Malik developed efficient conflict-driven learning strategies for SAT solvers. Together, these works established the approach that underlies modern CDCL solving.

## Conflict Analysis and Clause Learning

Consider a simple example involving four propositions:

    A → B
    B → C
    A → D
    ¬(C ∧ D)

Suppose we initially assume that A is true. From this assumption, we derive B, then C, and independently D. However, the final constraint states that C and D cannot both be true. Therefore, our initial assumption leads to a contradiction.

A traditional backtracking algorithm would abandon the assumption A = True and try another assignment. CDCL goes further. By analyzing the chain of implications, it learns a new clause:

    Learned clause: ¬A

This clause prevents the solver from reconsidering assignments where A is true. Importantly, the learned constraint is not an arbitrary correction; it is logically implied by the original constraints.

<figure class="cdcl-conflict-graph" aria-labelledby="cdcl-conflict-graph-title">
  <div class="cdcl-conflict-graph__canvas" role="img" aria-label="Assuming A is true derives B, C, and D. The simultaneous truth of C and D creates a conflict.">
    <svg class="cdcl-conflict-graph__edges" viewBox="0 0 1000 700" preserveAspectRatio="none" aria-hidden="true">
      <path d="M500 145 L230 282" />
      <path d="M500 145 L770 282" />
      <path d="M230 390 L230 457" />
      <path d="M230 565 L500 590" />
      <path d="M770 390 L500 590" />
    </svg>
    <div class="cdcl-conflict-graph__node cdcl-conflict-graph__node--assumption"><span>Decision</span><strong>A = True</strong></div>
    <div class="cdcl-conflict-graph__node cdcl-conflict-graph__node--derived cdcl-conflict-graph__node--b"><span>Propagation</span><strong>B = True</strong></div>
    <div class="cdcl-conflict-graph__node cdcl-conflict-graph__node--derived cdcl-conflict-graph__node--c"><span>Propagation</span><strong>C = True</strong></div>
    <div class="cdcl-conflict-graph__node cdcl-conflict-graph__node--derived cdcl-conflict-graph__node--d"><span>Propagation</span><strong>D = True</strong></div>
    <div class="cdcl-conflict-graph__node cdcl-conflict-graph__node--conflict"><span>C and D are incompatible</span><strong>Conflict</strong></div>
  </div>
  <figcaption id="cdcl-conflict-graph-title">The implication graph for the assumed assignment A = True. Since C and D cannot both be true, the graph ends in conflict.</figcaption>
</figure>

## Learning from Failure

The essential insight is that failure can produce reusable knowledge. Rather than merely reversing an incorrect decision, CDCL identifies why that decision was impossible and uses the explanation to guide subsequent search. This transforms reasoning from repeated trial and error into a process of progressively constraining the search space.

## From SAT Solvers to LLM Reasoning

This mechanism also offers an interesting perspective on reasoning in large language models. Many current approaches improve reasoning by generating longer chains of thought or exploring multiple candidate solutions. Yet increasing the number of reasoning steps does not necessarily improve the underlying reasoning mechanism.

For example, consider a language model solving a planning problem. It proposes completing task B before task C, but later discovers that B itself depends on C. Instead of simply restarting, the model could identify the circular dependency and record the conflicting requirements. Future reasoning could then avoid plans containing the same contradiction.

There is, however, an important distinction between CDCL and belief revision. CDCL learns constraints that are logically entailed by existing knowledge, preserving the original problem's meaning. Belief revision may instead require retracting previously accepted conclusions when new evidence arrives. Both concern the management of reasoning under conflict, but they operate on fundamentally different assumptions about what can change.

This reflection was inspired by Moshe Y. Vardi's "The Sweeter Lesson," published in *Communications of the ACM* in 2026. Responding to Richard Sutton's "The Bitter Lesson," Vardi highlights the remarkable success of SAT solving as an example of how algorithmic ingenuity and domain-specific insight can matter as much as, or more than, computational scaling alone.

CDCL illustrates this alternative perspective: progress does not come merely from exploring more possibilities, but from developing better mechanisms for reasoning about which possibilities can be eliminated.

This raises a broader question for AI research: Can intelligent systems learn not only from successful reasoning, but also from conflicts, contradictions, and revisions of previously accepted beliefs?

Perhaps deep reasoning should be measured not only by how much computation a system performs, but also by how effectively it transforms failures into reusable knowledge.

## Reference

- João P. Marques-Silva and Karem A. Sakallah, ["GRASP—A New Search Algorithm for Satisfiability"](https://doi.org/10.1109/ICCAD.1996.569607), *Proceedings of the 1996 IEEE/ACM International Conference on Computer-Aided Design*, pp. 220–227, **1996**.
- Lintao Zhang, Conor F. Madigan, Matthew H. Moskewicz, and Sharad Malik, ["Efficient Conflict Driven Learning in a Boolean Satisfiability Solver"](https://doi.org/10.1109/ICCAD.2001.968634), *Proceedings of the 2001 IEEE/ACM International Conference on Computer-Aided Design*, pp. 279–285, **2001**.
- Moshe Y. Vardi, ["The Sweeter Lesson"](https://cacm.acm.org/opinion/the-sweeter-lesson/), *Communications of the ACM*, 2026.

<link rel="stylesheet" href="{{ '/assets/css/cdcl-conflict-graph.css' | relative_url }}">
