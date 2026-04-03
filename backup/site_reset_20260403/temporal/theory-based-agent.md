---
layout: distill
bibliography: all.bib
giscus_comments: false
disqus_comments: false
date: 2025-03-03
featured: true
img: assets/img/agents.png
title: 'Theory-based Agent'
category: 'AI'
description: 'Ontology, Theory, and Data'
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

---

After reading, Poole 2008, Agent, Decision, Belifes, Preferences, Science, and Politics

<img src="/assets/img/agents.png" width="50%" height="auto" class="styled-image"/>

[Image Credit: Alice Eggie](https://www.instagram.com/aliceeggie)

# Theory-Based Agent

When analyzing an agent, three key aspects must be distinguished: **capability**, **belief**, and **preference**.  **Capability** refers to whether an agent can perform a given task. This is determined by factors such as sufficient training and the robustness of the model against test cases.   **Belief**, on the other hand, includes assumptions about actions. A **theory** operates based on specific assumptions, focusing not just on whether something can be done but on how it is done. While theory influences success, making it intertwined with capability, it emphasizes that an agent acts based on assumptions rather than pure ability.   Lastly, **preference** indicates what the agent *wants* to do. Preferences exist because predictions about the future are inherently uncertain or because the agent has personal objectives that shape its choices.  

If two people are engaged in a debate, the way to resolve it is to evaluate which position is correct and make the better choice. However, concepts like *right and wrong* or *good and bad* often have ambiguous criteria, making them difficult to quantify. That said, if optimal decisions for the future can be made based on historical data, even preferences could be viewed as calculable.  

For an agent to function in the world, three components are essential: **ontology**, **theory**, and **data**.  **Ontology** provides structure to theory and data. For two entities to interact and communicate, they need a shared **terminology**. If terminology is undefined, messages exchanged between agents are nothing more than sequences of bits.  

Fundamentally, two agents always communicate by transmitting bits. The meaning of those bits is derived from each agent’s internally constructed **ontology**—a conceptual frame for interpreting the world. In other words, each agent possesses its own **knowledge graph**, which may not be entirely shared with others. While ontology representation systems like **RDF (Resource Description Framework)** and **OWL (Web Ontology Language)** serve as encyclopedic structures for describing the world, individual agents still develop their own conceptual relationships, which they then map onto a structured ontology. This process inevitably results in information loss. Ultimately, thoughts and ideas must be encoded into an ontology framework before they can be conveyed to others. Errors arise during this encoding process, and further errors occur when the recipient interprets the ontology.  

In society, individual ontological representations are often standardized into a shared **social ontology**, enabling communication within a community. Large models, such as LLMs, appear to internalize multiple ontologies probabilistically. However, traditional models tend to treat concepts in a more rigid manner. This can be likened to how categories in classical logic are often fixed—once something is classified under a certain concept, it does not change.  

Yet, categories are not always absolute. Take the concept of *a person*, for example. A child and an adult are both considered *humans*, yet their roles, rights, and capabilities differ significantly. Similarly, a patient in a vegetative state or a person uploaded into a digital system raises questions about whether they still fit within the conventional definition of *human*.  

This perspective aligns with **dynamic epistemic logic**, which models how knowledge and beliefs evolve over time. Rather than treating ontologies as static, this approach considers how agents revise their knowledge as they receive new information. If a concept like *human* can shift based on context and time, then ontologies themselves may inherently involve a degree of **uncertainty and adaptability**. This suggests that reasoning about knowledge should not only consider fixed truths but also how those truths might change under different conditions.