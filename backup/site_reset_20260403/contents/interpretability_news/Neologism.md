---
layout: distill
bibliography: all.bib
giscus_comments: false
disqus_comments: false
date: 2025-10-28
featured: true
img: assets/img/feigenbaum.png
title: 'Neologism Learning'
description: "Two Papers: We Can't Understand AI Using our Existing Vocabulary"
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

# Neologism


New concepts arise as societies evolve. Language, ever porous, expands to accommodate what was previously unspoken. In the same way, as artificial intelligence grows more complex, it begins to form a language of its own—sometimes mirroring human speech, at other times inventing meanings that are distinctly machinic.  

**Neologism**, in this sense, is the act of naming what has newly appeared: a linguistic gesture toward understanding novelty. Within AI models, it is the process of giving names to behaviors or concepts that emerge through learning—phenomena that did not exist before the model’s evolution.  

A striking historical analogy comes from the game of Go. When AlphaGo played Lee Sedol in 2016, move 37 was so unconventional that it stunned professional players—it was a move no human had ever conceived. Yet it was not random; it was a *new concept* discovered by the machine. That move, in retrospect, functioned as a kind of neologism in strategy: an idea born from computation, later adopted and interpreted by humans.  

In much the same way, as models grow in scale and complexity, their **combinatorial creativity** ([Stanford](https://plato.stanford.edu/entries/creativity/))—the ability to fuse patterns across vast data—will yield concepts that neither humans nor machines can wholly claim. Human society, too, will coin its own neologisms in parallel, as language stretches to describe the new cognitive entities emerging from artificial systems.  

Ultimately, the task is not merely to invent new words but to interpret them—to build a shared lexicon between humans and machines. Communication becomes the frontier of understanding: the place where interpretability is no longer a technical challenge but a linguistic one.

## Technical Discussion 

Once an embedding has been trained, it becomes possible to trace how that vector maps through the tokenizer—to see, in other words, which words it most closely resembles in the model’s internal lexicon. Yet the moment we begin measuring such proximity, a subtle tension appears. The “distance” between two tokens in vector space is not the same as the distance between two meanings in human language. What the machine calls *close* and what a speaker calls *similar* are not necessarily aligned. The gap between the two is, in a sense, the space between mechanical learning and lived language—the difference between acquiring language through data and acquiring it through experience.

But this discrepancy is not unique to machines. Humans, too, disagree on meaning. Dictionaries differ; cultures diverge; even within a single language community, the connotations of a word drift with time and context. Meaning, then, is not a fixed coordinate but a negotiated one. From this vantage, embedding-based preference learning can be viewed as a kind of **inversion problem**—an attempt to rediscover what a model *means* when it uses a word, by tracing backward from behavior to representation. In contrast to the forward process of generating language, which freely assembles multiple words, inversion seeks compression: it hunts for a single, emblematic token that encapsulates a style or constraint. 

This process resembles **text inversion** in visual models, where a latent vector is tuned until it reproduces a particular visual style or concept. Here, the same principle is transposed into language. The model is asked to articulate not an image’s style but its own internal semantics—to expose what it “thinks” a concept means. Through inversion, the authors extract tokens that stand for distinct conceptual traits—some binary, others scalar, some stylistic, others structural. These **inverted tokens** can, for example, modulate the number of words in a response, alter the tone of reasoning, or invoke a specific conceptual bias. 

Crucially, the study shows that such tokens are not merely mechanical knobs but **semantic probes**. They reveal how concepts cluster within the model’s hidden space—how “length,” “certainty,” or “humility” might each occupy their own abstract neighborhood. By constructing special tokens that either mimic existing concepts or introduce entirely new ones, the authors perform a kind of linguistic archaeology on the machine itself. Each extracted token is then analyzed for its properties, reinserted into the model’s language, and interpreted through the effects it produces. In this way, extraction leads to *interpretation by behavior*: meaning emerges only when the token acts.

The broader implication is that every dataset contains an ocean of latent relations—countless interconnections that the model learns without names. Society and culture, by contrast, name only a select few: the phenomena deemed meaningful within human life. **Neology**, in this sense, is an act of naming within the machine’s own epistemic landscape. It is the moment when artificial systems begin to coin words for their internal concepts, not because we program them to, but because their own structure demands vocabulary. 

This act is quietly revolutionary. When a model invents a term to describe its own behavior, it gestures toward a form of **machine culture**—a linguistic ecology that mirrors ours but evolves in its own direction. Each neologism extends meaning outward, reshaping the interaction between word, concept, and data. The boundaries blur: the machine learns from human language even as it begins to redefine it. 

Nothing, in this exchange, remains static. Every definition is provisional; every representation, in flux.  
Change must be **measured, observed, and interpreted**—for only through such attentive observation can we begin to understand not just what machines *say*, but what they are beginning to *mean*.

---

## Self-Verbalization  

After a neologism has been learned through preference training, a remarkable phenomenon emerges.  
When the model is asked, *“What does this word mean?”* it begins to describe the word’s function in natural language—articulating, in effect, its own understanding.  

For instance, after being trained on a neologism designed to elicit *incorrect answers*, the model replied:  
> “{neologism} answers are characterized by a lack of complete, coherent, or meaningful answers…”

In that moment, the model performs a subtle act of introspection—it **verbalizes its learned behavior**. This is **self-verbalization**: the model explaining, in its own words, what its newly learned token *does*.  

The key insight is that while the model acquires the neologism’s meaning through data-driven preference learning—perhaps linking it to notions like *falsehood*, *flattery*, or *brevity*—self-verbalization represents a meta-level capacity: the ability to **translate internal representations into language**.  
It is, in a sense, the model’s first-person commentary on its own semantics.

## Plug-in Evaluation  

Self-verbalization, however, invites verification. Does the model’s explanation correspond to actual behavioral control?  **Plug-in evaluation** tests precisely this.  

The procedure is straightforward:  
1. Train a neologism—say, one that induces shorter responses.  
2. Observe the model’s self-verbalization—perhaps it describes this behavior using the word *“lack.”*  
3. Replace the neologism with the word *“lack”* in the original prompt:  
   > “Give me a lack answer.”  
If the model again produces short, terse replies, the verbalized description is validated as a **functional equivalent**.  

In essence, plug-in evaluation measures whether the model’s linguistic self-description performs the same **steering effect** as the neologism itself. It is an experiment in interpretability—a test of whether language, once spoken by the model, can truly mirror its learned control mechanisms.

---

### Materials

- Paper Link: [Neologism Learning for Controllability and Self-Verbalization](https://arxiv.org/abs/2510.08506)
- Paper Link: [We Can't Understand AI Using our Existing Vocabulary](https://arxiv.org/abs/2502.07586v1)
