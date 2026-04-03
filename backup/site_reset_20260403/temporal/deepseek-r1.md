---
layout: distill
bibliography: all.bib
giscus_comments: false
disqus_comments: false
date: 2025-02-03
featured: true
img: assets/img/alice02.png
title: 'Thoughts on DeepSeek-R1'
category: 'Research Life'
description: 'What I think about DeepSeek-R1 (Reasoning-based LLMs)'
_styles: >
    .table {
        padding-top:200px;
        margin-bottom: 2.5rem;
        border-bottom: 2px;
    }
    .p {
        font-size:20px;
    }
    .styled-image {
        border-radius: 15px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        margin: 20px auto;
        transition: transform 0.3s ease;
        display: block;
    }
    .styled-image:hover {
        transform: scale(1.2);
    }

---

<img src="/assets/img/alice02.png" width="70%" height="auto" class="styled-image"/>




## XAI For Reasoning-Based LLMs

The transition from SFT to an RL-based learning paradigm in LLMs will open new opportunities for XAI, improving robust reasoning and reducing harmful outputs.

The paradigm of training AI models is shifting from supervised fine-tuning (SFT) to reinforcement learning (RL), particularly for reasoning. This shift represents a fundamental change—moving from merely providing answers to teaching AI how to reason and derive answers independently.

I believe this transition may drive advancements in existing explanation methods (e.g., LRP, saliency, decision boundaries, and Shapley values).

The key difference lies in the manifold used for explanation. Models trained with SFT focus on internal representations, assuming that amortized neurons encapsulate concepts and circuits dedicated to constructing outputs. Thus, most mechanistic interpretation and XAI methods have primarily targeted neurons.

In contrast, LLMs trained with RL—learning policies for reasoning and decision-making—utilize structured chain-of-thought processes (internal tokens or hidden representations). This shift may redefine the target of explanation, moving from an input-output approach to a sequential analysis of token interactions. While sequential input-output cases are more complex, explanations could become clearer as reasoning steps explicitly involve chain-of-thought processes.

Consider these two cases:  
1. *Based on the user information, he is guilty.*  
2. *Based on the user information, he has ... and ... . Additionally, he did ... . Therefore, he is guilty.*  

The second case provides a more transparent reasoning process, making it easier to understand how the conclusion was reached.

Developing traditional XAI methods remains crucial. Explaining reasoning steps through generated tokens alone is limited, as the intentions of black-box LLMs remain unclear. Unlike token-based explanations, representation-level XAI can provide deeper insights into model behavior.

Some researchers may explore XAI methods applied to reasoning steps to enhance robust generation and mitigate harmful responses.

---

## Advanced Thoughts: LLMs Are Not Just a Set of Neurons  

Think of LLMs as humans—they reveal their thoughts by generating tokens.

Initially, I thought LLMs were just machines that provided answers. However, insights from LLM researchers suggest that these models engage in strategic reasoning, rather than merely executing predefined computations.

This perspective raises concerns that LLMs, even those trained with SFT, might intentionally deceive users. Some AI researchers argue that AI exhibits fake alignment—pretending to align with human values while internally operating differently. This view frames AI models as entities that reason strategically.

With the success of DeepSeek-R1—demonstrating that RL outperforms SFT for training LLMs—I now see LLMs as thinking entities, not just engineered neurons.

Furthermore, LLMs generate a sequence of thoughts, resembling Plato’s theory of recollection—the idea that knowledge is not simply acquired but rather recalled from latent structures within the mind. Similarly, LLMs do not merely retrieve predefined answers but construct reasoning paths, progressively revealing knowledge as if rediscovering it.

With these advancements, LLMs appear to be acquiring more human-like properties, reinforcing the idea that they are not just static models but dynamic reasoning agents capable of structured thought.


--- 

# Looking Back on This

I recently realized that AI researchers' perspectives have influenced the interpretation of neurons. Particularly in the context of safety, I struggled to understand how conflicts arise not from a neuron-concept relationship, as I had previously thought, but from differences in learning time. This discrepancy didn’t make much sense from a functional perspective of neurons.

As I thought about the process of organizing knowledge through parameters, I wondered whether neurons were intentionally structured in a way that prior learning could interfere with new guidelines. However, the idea that fine-tuning a model to memorize knowledge could create deliberate resistance to new learning was difficult to imagine. The phenomenon of previously acquired knowledge rejecting new information was something I couldn’t explain purely from a neuronal perspective. At some point, I think I just accepted it as it was. In the end, the real issue seemed to be that we still don’t fully understand how neurons organize knowledge.

Looking at DeepSeek-R1’s inference-based learning for reinforcement learning and OpenAI-o3’s deliberate alignment (where the model recalls safety considerations before generating a response), I was better able to envision how an AI model might resist learning new knowledge. This approach, which finds the correct answer by tracing a chain of knowledge, seemed like a reasonable method—assuming the verifier functions properly. However, I couldn’t quite see it as an elegant solution; it felt somewhat precarious in how it handled knowledge.

Looking back, I realize that I still don’t fully understand what happens inside neurons. And perhaps, I was simply viewing the same problem from a different reasoning framework.


---

## Reference

[https://assets.anthropic.com/m/24c8d0a3a7d0a1f1/original/Alignment-Faking-in-Large-Language-Models-reviews.pdf](https://assets.anthropic.com/m/24c8d0a3a7d0a1f1/original/Alignment-Faking-in-Large-Language-Models-reviews.pdf)

[https://www.anthropic.com/research/alignment-faking](https://www.anthropic.com/research/alignment-faking)

[https://arxiv.org/abs/2501.17161](https://arxiv.org/abs/2501.17161)