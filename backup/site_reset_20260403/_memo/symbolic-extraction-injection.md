---
layout: distill
authors: 
    - name: Bumjin Park
      affiliations:
        name: KAIST
bibliography: all.bib
giscus_comments: false
disqus_comments: false
date: 2024-12-29
featured: true
img: assets/img/bp.png
title: '[Representation] <br> Symbolic Knowledge Extraction vs Injection'
category: 'AI'
description: 'Symbolic Knowledge Extraction vs Symbolic Knowledge Injection'
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

> This post is a study note of the paper "Symbolic knowledge extraction and injection with sub-symbolic predictors: A systematic literature review " by Ciatto et al. (2024).

## Introduction


### Background
- Overview of symbolic and sub-symbolic paradigms in AI.
- Importance of knowledge extraction and injection.
- Objectives of the article: comparative insights into symbolic knowledge extraction (SKE) and symbolic knowledge injection (SKI).

## Conceptual Foundations

### What is Symbolic Knowledge Extraction (SKE)?

> **Definition**  
> Symbolic Knowledge Extraction (SKE) is the process of deriving intelligible and interpretable knowledge representations from sub-symbolic predictors, such as neural networks or other machine learning models. 

The goal is to make the learned behavior of these models accessible and understandable to humans, enabling interpretability and transparency in decision-making processes. This process often involves translating the numerical or distributed representations of knowledge in sub-symbolic models into symbolic forms, such as logic rules, decision trees, or human-readable texts. SKE serves as a key enabler for Explainable AI (XAI), bridging the gap between complex machine learning models and human users.

- Process overview (e.g., extraction from sub-symbolic predictors).
- Applications and relevance in explainable AI (XAI).


### What is Symbolic Knowledge Injection (SKI)?

> **Definition**  
> Symbolic Knowledge Injection (SKI) refers to the process of integrating symbolic knowledge—often derived from human expertise, formal logic, or structured data—into sub-symbolic predictors. 


This ensures that these models operate in alignment with predefined rules, constraints, or domain-specific knowledge.   By injecting symbolic knowledge, SKI can guide or constrain the learning process, enhance model performance, or enforce consistency with ethical and practical considerations. This is achieved through techniques like embedding symbolic knowledge as input, structuring predictors to align with symbolic knowledge, or penalizing inconsistent behaviors during training.


- Process overview (e.g., injection into sub-symbolic predictors).
- Applications and relevance in enhancing predictor control.

## Key Features and Dimensions of Comparison

### Input/Output Nature
- Data types and formats used in SKE and SKI.
- Examples of symbolic and sub-symbolic representations.
- Expressiveness and fidelity in extracted and injected knowledge.


#### Data types and formats used in SKE and SKI.

SKE primarily processes sub-symbolic data such as numeric arrays (vectors, matrices, tensors) and outputs symbolic forms like logic rules or decision trees.  
SKI, on the other hand, takes symbolic inputs, such as knowledge graphs or formal logic, and integrates them into sub-symbolic models.

#### Fidelity 

> **Definition**  
> Fidelity refers to the degree to which the extracted or injected symbolic knowledge accurately reflects the behavior or constraints of the sub-symbolic model.  

Fidelity is about how much the extracted or injected symbolic knowledge accurately reflects the behavior or constraints of the sub-symbolic model. For SKE, high fidelity ensures that the extracted solymbic knowledge mirrors the decision-making logic of the predictor. For SKI, fidelity guarantees that the injected knowledge is faithfully incorporated into the model's functioning.


### Methods and Strategies

#### Extraction: Pedagogical (교육적인) vs Decompositional Approaches

- **Pedagogical Approach**
  The pedagogical approach treats the sub-symbolic predictor as a "black box" and focuses solely on its input-output behavior. It uses the model's outputs to derive symbolic knowledge without inspecting its internal structure. This method is highly generalizable and can be applied to any model type, as it does not depend on the model's architecture. However, the fidelity of the extracted knowledge may be limited compared to decompositional methods. A good example is LIME. 

- **Decompositional Approach**  
  The decompositional approach involves inspecting the internal structure of the sub-symbolic model, such as weights, neurons, or decision boundaries, to extract symbolic knowledge. This method is often more precise, as it leverages detailed information about the model's internal workings. However, it is model-specific and typically limited to predictors with well-understood architectures, such as neural networks or decision trees. A good example is network dissection. 

Pedagogical methods prioritize generality and ease of application but may sacrifice some accuracy in the extracted knowledge. Decompositional methods provide higher fidelity and detailed insights but are more complex and less flexible, requiring access to model-specific internal details.

#### Injection: Knowledge Embedding, Guided Learning, and Predictor Structuring in SKI

- **Knowledge Embedding**  
  This approach converts symbolic knowledge into numerical representations, such as vectors, matrices, or tensors, which are then integrated into the sub-symbolic model as part of its input or structure. By embedding symbolic knowledge, the model can process it in a way that aligns with its existing numerical operations.  
  **Example**: Knowledge graph embeddings where structured relationships (e.g., in ontologies) are transformed into dense vector representations for use in neural networks.

- **Predictor Structuring**  
  Predictor structuring involves modifying the architecture of the sub-symbolic model to align with the symbolic knowledge. The structure of the model itself is designed to directly encode the provided symbolic knowledge, such as logic rules or decision trees, ensuring that the model inherently respects the knowledge during its operation.  
  **Example**: Neural networks designed with layers or connections that mimic logical operations (e.g., neurons representing AND/OR gates for logic rules).

- **Guided Learning**  
  Guided learning incorporates symbolic knowledge as constraints or incentives during the model training process. By modifying the loss function, the model is encouraged to adhere to the provided knowledge or penalized for inconsistent behaviors. This method ensures the model aligns with human-defined rules or domain-specific logic.  
  **Example**: Adding a penalty term in the loss function to enforce consistency with logical constraints, such as ensuring that predictions respect specific domain rules.


**Knowledge Embedding** is versatile and enables models to utilize symbolic knowledge as part of their inputs. **Predictor Structuring** ensures the symbolic knowledge is inherently integrated into the model’s architecture, providing robust adherence to the rules. **Guided Learning** directly influences the model’s behavior by constraining its learning process.  

## Challenges and Opportunities

#### Opacity and interpretability issues addressed by SKE.
Symbolic Knowledge Extraction (SKE) addresses one of the most significant challenges in artificial intelligence: the opacity of sub-symbolic models like neural networks. These models often function as "black boxes," making their decision-making processes difficult to interpret. SKE tackles this by converting these opaque models into interpretable forms, such as logic rules or decision trees, enabling transparency and trust in AI systems. However, achieving high fidelity between the extracted symbolic knowledge and the original model's behavior remains a persistent challenge.


#### Consistency and control challenges addressed by SKI.
Symbolic Knowledge Injection (SKI) deals with consistency and control challenges in sub-symbolic models. By injecting symbolic knowledge, SKI ensures that models adhere to predefined rules, ethical considerations, or domain-specific logic. This enhances the reliability and robustness of AI systems, especially in critical applications. However, integrating symbolic knowledge effectively into sub-symbolic frameworks without sacrificing model performance or flexibility is a complex task.

#### Emerging trends and potential synergies between SKE and SKI.

Emerging trends highlight the potential synergies between SKE and SKI. Together, they can form a continuous loop where extracted knowledge is refined and reintegrated into models, improving both interpretability and performance. This interplay opens opportunities for hybrid AI systems that leverage the strengths of both symbolic and sub-symbolic approaches, paving the way for more transparent, adaptable, and controllable AI solutions.

## Hybrid Systems and Interoperability

### Combined Use of SKE and SKI

The combination of Symbolic Knowledge Extraction (SKE) and Symbolic Knowledge Injection (SKI) creates a powerful synergy, allowing hybrid systems to seamlessly integrate symbolic and sub-symbolic approaches. SKE makes sub-symbolic models interpretable by extracting knowledge in symbolic forms, while SKI ensures that models operate within human-defined constraints by injecting symbolic knowledge. Together, they form a theoretical foundation for hybrid symbolic-sub-symbolic systems, enhancing transparency, adaptability, and control.

### TEFI (Train–Extract–Fix–Inject) Loop Process

1. **Train**: Train the sub-symbolic model (e.g., neural network) on available data to achieve desired predictive performance.
   
2. **Extract**: Use Symbolic Knowledge Extraction (SKE) to derive interpretable symbolic knowledge (e.g., logic rules or decision trees) from the trained model. This step provides insights into the model's reasoning process.

3. **Fix**: Analyze the extracted knowledge to identify inconsistencies, errors, or areas where alignment with domain-specific rules or objectives is needed. Modify and refine the symbolic knowledge accordingly.

4. **Inject**: Reintegrate the refined symbolic knowledge back into the sub-symbolic model using Symbolic Knowledge Injection (SKI). This ensures that the model adheres to the corrected or enhanced symbolic rules.

5. **Iterate**: Repeat the loop as necessary to continuously improve the model's interpretability, consistency, and performance.

<img src="https://1drv.ms/i/c/ae042a624064f8ca/IQQuzb-ovSSMS4ywkdE2L4btAVQOa-GY58t3o8gIVLqhO5Q?width=1024" alt="TEFI" class="styled-image">


The "Train–Extract–Fix–Inject (TEFI)" loop proposed in the literature exemplifies this synergy. In this loop, knowledge extracted via SKE is analyzed and refined to correct any inconsistencies or align with domain-specific requirements. This refined knowledge is then reintroduced into the model using SKI. The TEFI loop enables continuous improvement of models, ensuring that they remain interpretable, reliable, and aligned with human-defined objectives. It bridges the gap between interpretability and performance by iteratively refining both the symbolic and sub-symbolic components.


### Practical Benefits

One of the most significant practical advantages of combining SKE and SKI is the ability to debug sub-symbolic models effectively. Through the TEFI loop, extracted symbolic knowledge can be inspected and corrected, enabling data scientists to identify and address errors in the model’s reasoning process. This approach ensures that sub-symbolic models operate within the boundaries of logical rules, ethical constraints, and domain-specific knowledge, creating a more robust and trustworthy AI system.

Additionally, SKE and SKI facilitate the use of symbolic knowledge as a lingua franca for intelligent agent systems. By representing knowledge in symbolic forms that are both human- and machine-interpretable, these techniques enable better interoperability among heterogeneous agents. Symbolic knowledge extracted from one model can be shared, modified, and reinjected into other models, promoting collaboration and adaptability in multi-agent systems. This capability is particularly valuable in complex systems where multiple agents with diverse learning paradigms must work together seamlessly.

