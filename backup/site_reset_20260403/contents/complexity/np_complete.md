---
layout: distill
bibliography: all.bib
giscus_comments: false
disqus_comments: false
date: 2025-11-15
featured: true
img: assets/img/feigenbaum.png
title: 'Complexity Classes?'
description: "Randomly choose an element and evaluate in polynomial time  (Non-deterministic P)"
_styles: >
    .pioneer-container {
        background: #000;
        color: #fff;
        font-family: 'Times New Roman', serif;
        padding: 2rem;
        max-width: 1200px;
        margin: 0 auto;
    }
    .pioneer-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2rem;
        padding-bottom: 1rem;
        border-bottom: 1px solid #d4af37;
    }
    .pioneer-title {
        font-size: 1.5rem;
        font-weight: normal;
        margin: 0;
    }
    .pioneer-subtitle {
        font-size: 1.5rem;
        font-weight: normal;
        margin: 0;
        position: relative;
    }
    .pioneer-subtitle::after {
        content: '';
        position: absolute;
        bottom: -1rem;
        left: 50%;
        transform: translateX(-50%);
        width: 20px;
        height: 2px;
        background: #d4af37;
        border-radius: 1px;
    }
    .pioneer-intro {
        font-size: 1.1rem;
        line-height: 1.6;
        margin-bottom: 3rem;
        text-align: left;
    }
    .pioneer-table {
        width: 100%;
        border-collapse: collapse;
    }
    .pioneer-table th {
        text-align: left;
        font-weight: normal;
        font-size: 1rem;
        padding-bottom: 1rem;
        border-bottom: 1px solid #d4af37;
        color: #fff;
    }
    .pioneer-table td {
        padding: 0.8rem 0;
        border-bottom: 1px solid #333;
        font-size: 0.95rem;
        vertical-align: top;
    }
    .pioneer-table tr:hover {
        background: rgba(212, 175, 55, 0.05);
    }
    .pioneer-date {
        width: 15%;
        font-variant-numeric: tabular-nums;
        padding-right: 2rem;
    }
    .pioneer-title-col {
        width: 60%;
        font-weight: 500;
    }
    .pioneer-media {
        width: 25%;
        color: #d4af37;
        text-transform: uppercase;
        font-size: 0.85rem;
        letter-spacing: 0.5px;
    }
    .pioneer-link {
        color: #fff;
        text-decoration: none;
    }
    .pioneer-link:hover {
        color: #d4af37;
        text-decoration: underline;
    }
    /* 모바일 반응형 스타일 */
    @media (max-width: 768px) {
        d-article {
            padding-left: 1rem !important;
            padding-right: 1rem !important;
            box-sizing: border-box;
        }
        d-article * {
            max-width: 100%;
            box-sizing: border-box;
        }
        d-article p, d-article h1, d-article h2, d-article h3, d-article h4, d-article h5, d-article h6, d-article li, d-article a {
            word-wrap: break-word;
            overflow-wrap: break-word;
        }
        d-article img, d-article iframe, d-article video {
            max-width: 100% !important;
            height: auto !important;
        }
        .pioneer-container {
            padding: 1rem;
        }
    }
---

## 1. Deterministic vs. Nondeterministic Computation

A **deterministic** machine behaves like a normal computer:  
given an input and a current state, it has exactly one possible next action.  
It follows a single, predictable computation path.

A **nondeterministic** machine is a theoretical model that can  
*magically guess* a correct solution among many possibilities.  
If a valid witness exists, the machine chooses it instantly and then  
**verifies** it using a deterministic algorithm that must run in polynomial time.

This “guess + verify” idea is the foundation of the complexity class $~NP~$.



## 2. Polynomial-Time Computation: P and NP

Polynomial time refers to any running time of the form

$$
n^k \quad \text{for some constant } k.
$$

- **P** is the class of problems solvable in polynomial time on a deterministic machine.  
  These are considered “efficiently solvable.”

- **NP** is the class of problems whose solutions (called *witnesses*)  
  can be **verified** in polynomial time on a deterministic machine.  
  Equivalently, NP is the class solvable in polynomial time on a nondeterministic machine.

Because deterministic computation is weaker than nondeterministic guessing, we know:

$$
P \subseteq NP.
$$

Whether $~P = NP~$ or $~P \neq NP~$ is one of the most famous open problems in computer science.


## 3. Reductions and How Problems Become Equivalent

To compare the difficulty of two problems, we use **polynomial-time reductions**.

A problem $~A~$ reduces to a problem $~B~$ (written $~A \le_p B~$)  
if any instance of $~A~$ can be transformed into an instance of $~B~$  
in polynomial time such that solving $~B~$ solves $~A~$.

This gives us a formal notion of difficulty:

- If $~A \le_p B~$, then **$~B~$ is at least as hard as $~A~$**.  
- If two problems reduce to each other, they are **equivalent in complexity**.

This reduction idea is what allows us to define NP-complete problems.


## 4. NP-Complete Problems: The Hardest Problems in NP

A problem $~C~$ is **NP-complete** if:

1. $~C \in NP~$, and  
2. every NP problem reduces to $~C~$:

$$
\forall A \in NP,\; A \le_p C.
$$

This means NP-complete problems are the **hardest problems inside NP**.  
If any NP-complete problem is solved in polynomial time, then:

$$
P = NP.
$$

Examples include **SAT**, **3-SAT**, **Clique**, **Vertex Cover**,  
and **Traveling Salesman (decision version)**.

Even though these problems look very different,  
polynomial-time reductions show that they all have exactly the same computational difficulty.


## 5. PSPACE and PSPACE-Complete Problems

Above NP lies the larger class **PSPACE**,  
the class of problems solvable with **polynomial space** (memory),  
regardless of how much time is required.

A PSPACE algorithm may run for exponential time,  
as long as it reuses its space efficiently.

A problem is **PSPACE-complete** if:

1. it can be solved in polynomial space, and  
2. every PSPACE problem reduces to it.

The classic PSPACE-complete problem is **QBF**  
(Quantified Boolean Formula), which extends SAT by allowing  
alternating existential and universal quantifiers like $~\exists~$ and $~\forall~$.  
This creates a game-like logical structure that requires significantly more power to analyze.

PSPACE-complete problems are believed to be much harder than NP-complete problems.

The Polynomial Hierarchy: $\Sigma_k$ and $\Pi_k$

Between NP and PSPACE lies a layered structure called the **Polynomial Hierarchy (PH)**.  
It refines NP by counting how many layers of nondeterminism and universality  
(“there exists” vs. “for all”) a problem requires.

## Layers of the hierarchy

- $~\Sigma_1 = NP~$  
  (Exists-witness form: “$\exists x$ such that the condition is satisfied”)

- $~\Pi_1 = coNP~$  
  (For-all-witness form: “$\forall x$ the condition holds”)

Higher levels alternate quantifiers:

- $~\Sigma_2~$: problems expressible like  
  $$
  \exists x_1 \; \forall x_2 \; \phi(x_1, x_2)
  $$
- $~\Pi_2~$:  
  $$
  \forall x_1 \; \exists x_2 \; \phi(x_1, x_2)
  $$

And so on:

$$
\Sigma_1 \subseteq \Sigma_2 \subseteq \Sigma_3 \subseteq \dots
$$

$$
\Pi_1 \subseteq \Pi_2 \subseteq \Pi_3 \subseteq \dots
$$


## 6. Higher Levels Above PSPACE

Beyond PSPACE, there are even stronger complexity classes:

- **EXPTIME**: problems solvable in exponential time  
- **EXPSPACE**: exponential space  
- **Undecidable problems**: problems no algorithm can solve in general

Each class is believed to strictly contain the one below it (though some separations are unproven).


## 7. The Big Picture

Here is the widely believed hierarchy of complexity classes:

$$
P \subseteq NP \subseteq PSPACE \subseteq EXPTIME \subseteq EXPSPACE \subsetneq \text{Undecidable}.
$$

Inside NP:

$$
P \subseteq NP \supseteq \text{NP-complete}.
$$

- **P**: efficiently solvable  
- **NP**: efficiently verifiable  
- **NP-complete**: hardest problems inside NP  
- **PSPACE**: problems solvable with polynomial space  
- **PSPACE-complete**: hardest problems in PSPACE  
- **Higher classes**: even more powerful or even unsolvable problems

This provides the overall structure of classical complexity theory.