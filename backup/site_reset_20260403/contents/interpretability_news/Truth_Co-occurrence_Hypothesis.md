---
layout: distill
bibliography: all.bib
giscus_comments: false
disqus_comments: false
date: 2025-10-27
featured: true
img: assets/img/feigenbaum.png
title: 'Truth Co-occurrence Hypothesis (TCH)'
description: 'Paper: Emergence of Linear Truth Encodings in Language Models'
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
---


# Truth Co-occurrence Hypothesis (TCH)

We know where truth ends and falsehood begins. Most of us carry around a private border checkpoint—imperfect, but serviceable—between what we will assent to and what we push away. A [recent paper](https://arxiv.org/abs/2510.15804) slated for NeurIPS 2025 turns that intuition into an object of study. In a one-layer Transformer, the authors ask, what mechanism allows the model to tell truth from lie? Their starting premise is disarmingly simple: **truths tend to travel together**.

They call it the **Truth Co-occurrence Hypothesis (TCH)**: in naturally occurring text, true statements are statistically more likely to co-occur with other true statements, and falsehoods with other falsehoods. The word “together,” though, does double duty.

First, pairs of factual associations appear together. If a pair $(X, Y)$ encodes a true relation, later we often see a related pairing $(X', Y')$ that rhymes with it. This is partly definitional—the world repeats itself.

Second, **entities and attributes** appear together in both directions. If an entity $X$ goes with an attribute $y$, the reverse association also shows up. When both directions are present, the sum of their representational vectors is smaller in magnitude than other, mismatched combinations—in my reading, a speculative but suggestive point.

From these two senses of co-occurrence the model inherits two capacities. From the first, it learns a boundary that separates “fact-like” from “non-fact-like.” From the second, it learns that a given pair stands in a factual relation. Consider a linear association memory $W$ that links entities and attributes. If $y = W x$ and, conversely, $x = W^{-1} y$, then $x$ and $y$ form a unique pair. In that case, the vector produced by combining the outputs—call it the “pair vector”—has a smaller norm than mismatched pairs, which makes it easier to distinguish from false ones. Feed the model a true pair $(x, g(x))$ and it tends to speak truth later, by analogy.

In this picture, factual information collects around configurations like $(x, y, x')$. The authors report that, just before the unembedding layer of a one-layer Transformer, truth and falsehood become **linearly separable**.

The hinge of the story is LayerNorm ([see the beauty of LN](https://www.alignmentforum.org/posts/jfG6vdJZCwTQmG7kb/re-examining-layernorm)). A linear decision boundary, it seems, requires normalization. Merely “canceling out” a pair $(X, y)$ reduces magnitude but leaves direction intact; without a change in direction, linear separation is elusive. LayerNorm alters that geometry. Vectors with small norms are pulled toward the mean; magnitude becomes direction. That reparameterization helps open a margin—a provable one, according to the paper—so that a linear separator can exist with a quantifiable minimum.

Summarized starkly: the model’s ability to distinguish true from false emerges from clustering truths by their habit of appearing together, while pushing falsehoods to a different part of space.

To their credit, the authors frame this as **one mechanism among several**. Truth in a model is likely plural: many small engines turning, not a single master gear.

### What I learned about research 

Read [this paper](https://arxiv.org/abs/2510.15804) with a patient eye and you’ll see the method at work. Assume a distribution over data; examine the shape of the model’s representations; write the math that seems to govern that shape; watch the training dynamics; and then, from a simple schema for true/false examples, derive the model’s responsiveness. The presence of LayerNorm, in this account, makes linear boundaries not just plausible but likely.

There is more here than a single experimental trick. The paper lingers on representational geometry—how space is bent, scaled, and sorted in ways that reveal familiar Transformer habits. It invites a slower, more granular reading.


## A few confusions and caveats (which may well be mine):

- The authors replace the causal masking used in LLMs with uniform attention so that $(x, y, x', y')$ can mutually attend. This makes it possible to backtrack from $y$ to $x$, which actual autoregressive LLMs cannot. Still, that backtracking—when a pair $(X, g(X))$ is presented simultaneously—seems to be the link that produces smaller-norm vectors via $W$, a step that feels essential to their construction.

- The probing appears to happen after LayerNorm and before unembedding. The matrix $W$—their “key–value association memory”—is interpreted from the attention’s value output. Inputs form queries; $W$ turns them into outputs. When truths go in, their pair vectors land in a region distinct from false pairs.

- About TCH’s converse: if two things co-occur, does the model therefore learn them as true or false? Probably not. It’s more apt to say the paper studies how co-occurrence (versus random, unpaired appearances) sculpts the representation space, rather than adjudicating “truth” in the philosophical sense. Operationally, “truth” here means “consistently co-occurring,” without commitments about causality, belief, or justification.

- To check TCH, they examine the MAVEN-FACT dataset and ask how often false sentences appear within the same document. The pattern is that false sentences tend to live in “false” documents. Thus, after observing the first relation in $(x, y, x', y')$, a model might carve out regions it internally treats—by the dataset’s own semantics—as true versus false.

For the mathematically inclined, the heart of the argument is a small algebra of pairing and normalization:
$$
y = W x,\quad x = W^{-1} y,\quad \text{and}\quad \|x + y\| < \|x + y'\|.
$$
LayerNorm converts small $\|x + y\|$ into a directional cue, enabling a linear separator to form upstream of the unembedding.

There is elegance in the modesty of that claim: not that Transformers “understand” truth, but that the geometry of repeated, compatible statements can make truth look like a low-norm, high-signal direction.

---

### Material
- Paper Link: [arXiv:2510.15804](https://arxiv.org/abs/2510.15804)
- Post of the first author, Shauli Ravfogel: [X.com](https://x.com/ravfogel/status/1981364214188167594?s=12)
