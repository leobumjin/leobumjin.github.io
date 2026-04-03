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
img: https://d2acbkrrljl37x.cloudfront.net/bumjini-blog/study_post/resource-rational-analysis01.png
title: 'Resource-rational analysis'
category: 'Cognitive Science'
description: 'Understanding human cognition as the optimal use of limited computational resources'
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

<img src="https://d2acbkrrljl37x.cloudfront.net/bumjini-blog/study_post/resource-rational-analysis01.png" width="70%" height="auto" class="styled-image"/>


### Integration of Bottom-Up and Top-Down Approaches in Cognitive Modeling

The integration of **bottom-up cognitive constraints** and **top-down rational principles** is emerging as a promising approach across multiple disciplines. Initial findings indicate that combining these strengths leads to more robust models capable of explaining a broader range of cognitive phenomena. 

#### Key Applications:
- **Economics**: Development of mathematical models for bounded-rational decision-making to account for deviations from classic rationality (e.g., Simon 1956; Gabaix et al. 2006).
- **Neuroscience**: Investigation of how the brain balances accuracy and metabolic cost in representing the world (e.g., Levy & Baxter 2002; Niven & Laughlin 2008).
- **Linguistics**: Analysis of language as a system optimized for efficient communication (e.g., Hawkins 2004; Zaslavsky et al. 2018).
- **Psychology**: Recent incorporation of cognitive constraints into rational models (e.g., Griffiths et al. 2015).

This interdisciplinary approach highlights the synergy between structural constraints and functional principles in advancing our understanding of cognition.


> Simon (1955; 1956) proposed that rational decision strategies must adapt to both the **environmental structure** and the **cognitive limitations** of the mind.  
> He introduced the concept of **satisficing**, where individuals use a heuristic to select the first option that meets a satisfactory threshold rather than searching for the optimal solution.  
>
> #### Key Influence:
> - This idea laid the foundation for the **theory of ecological rationality**, which argues that people adaptively use simple heuristics to exploit the structure of their natural environments.  
> - Notable contributions to this theory include works by **Gigerenzer & Goldstein (1996)**, **Gigerenzer & Selten (2002)**, **Hertwig & Hoffrage (2013)**, and **Todd & Gigerenzer (2012)**.  
>
> Simon’s framework emphasizes the interplay between cognitive constraints and environmental adaptation in shaping decision-making strategies.




<div style="border: 1px solid #ddd; border-radius: 8px; padding: 16px; background: #f9f9f9; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
  <p><strong>Anderson's Rational Analysis</strong></p>
  <p>Anderson (1990) introduced <strong>rational analysis</strong>, a paradigm for understanding human cognition as a rational adaptation to environmental structures and goals. This approach derives models of human behavior based on environmental assumptions, bridging the computational level of analysis to the algorithmic level.</p>
  <p>The principle of <strong>resource rationality</strong> allows researchers to construct rational process models that integrate functional assumptions with cognitive constraints. This has provided explanations for cognitive biases such as:</p>
  <ul>
    <li>Confirmation bias (Austerweil & Griffiths, 2011; Oaksford & Chater, 1994)</li>
    <li>Misconceptions of randomness (Griffiths & Tenenbaum, 2001)</li>
    <li>Gambler's fallacy (Hahn & Warren, 2009)</li>
    <li>Logical fallacies in argument construction (Hahn & Oaksford, 2007)</li>
  </ul>
  <p>Rational analysis emphasizes that evolution has adapted the human mind to align with the structure of our evolutionary environment (Buss, 1995).</p>
  <hr style="margin: 16px 0;">
  <img src="https://d2acbkrrljl37x.cloudfront.net/bumjini-blog/study_post/resource-rational-analysis02.png" width="70%" height="auto" class="styled-image"/>
  <p><strong>Six Steps of Rational Analysis:</strong></p>
  <ol>
    <li>Precisely specify the goals of the cognitive system.</li>
    <li>Develop a formal model of the environment to which the system is adapted.</li>
    <li>Make minimal assumptions about computational limitations.</li>
    <li>Derive the optimal behavioral function based on steps 1-3.</li>
    <li>Examine empirical literature to confirm the predictions of the model.</li>
    <li>If predictions do not align, iterate the process.</li>
  </ol>
</div>



<p><strong>Theory of Bounded Optimality</strong></p>
<p>AI researchers have developed a theory of rationality that addresses limited computational resources, known as <strong>bounded optimality</strong> (Horvitz, 1987; Russell, 1997). This theory designs optimal programs for agents with performance-limited hardware interacting with real-time environments.</p>
<p>A program is <em>bounded-optimal</em> for a given architecture if it allows the architecture to perform as well as or better than any other executable program. This idea has been applied to resource-bounded agents, like humans, to define how people can optimally use their finite time and cognitive resources (Griffiths et al., 2015; Lewis et al., 2014).</p>
<hr style="margin: 16px 0;">
<p><strong>Key Takeaway:</strong> The concept of bounded rationality as a constrained optimization problem serves as a foundation for <strong>resource-rational analysis</strong>, a paradigm for modeling cognitive mechanisms and representations that synthesizes these ideas into a unified framework.</p>


To express the principle of bounded optimality mathematically, the **resource-rational mind** \( m^* \) for a brain \( B \) interacting with the environment \( E \) is defined as:

$$
m^* = \arg \max_{m \in M_B} \mathbb{E}_{P(T, l_T | E, A_t = m(l_t))} \left[ u(l_T) \right],
$$

where:

- $ M_B $: The set of biologically feasible minds.
- $ T $: The agent's (unknown) lifetime.
- $ l_t = (S_0, S_1, \dots, S_t) $: The sequence of world states the agent has experienced until time $ t $.
- $ A_t = m(l_t) $: The action chosen by the mind $ m $ based on its life history $ l_t $.
- $ u(l_T) $: The utility function that assigns values to life histories $ l_T $.


> Our theory assumes that the cognitive limitations inherent in the biologically feasible minds $ M_B $ include:
> - A limited set of elementary operations (e.g., counting and memory recall are possible, but applying Bayes’ theorem is not).
> - Limited processing speed (each operation requires a certain amount of time).
> - Other constraints, such as limited working memory.
>
> Critically, the world state $ S_t $ is constantly changing as the mind $ m $ deliberates. Therefore, a **bounded optimal mind** $ m^* $ must not only generate good decisions but must also do so **quickly**. Since each cognitive operation takes time, bounded optimality often necessitates **computational frugality**.



### Explanation of the Two Formulas

#### 1. Resource-Rational Heuristic for a Single Decision or Inference
The formula defines the **resource-rational heuristic** $ h^* (s_0, B, E) $, which represents the best heuristic $ h $ that a brain $ B $ can use in a given environment $ E $ and belief state $ s_0 $ for a single decision or inference:

$$
h^*(s_0, B, E) = \arg \max_{h \in H_B} \left[ \mathbb{E}_{P(\text{result}|s_0, h, E, B)} \big[ u(\text{result}) \big] - \mathbb{E}_{t_h, \rho, \lambda | h, s_0, B, E} \big[ \text{cost}(t_h, \rho, \lambda) \big] \right],
$$

**Where:**
- $ H_B $: The set of heuristics executable by the brain $ B $.
- $ s_0 = (o, b_0) $: The observed state of the external world $ o $ and the initial belief state $ b_0 $.
- $ u(\text{result}) $: The utility of the result generated by the heuristic.
- $ \text{cost}(t_h, \rho, \lambda) $: The opportunity cost of applying the heuristic $ h $, which depends on:
  - $ t_h $: Time required for execution.
  - $ \rho $: Cognitive resources utilized.
  - $ \lambda $: Opportunity cost per unit of resource and time.

This formula balances **utility** (accuracy of the result) with **cost** (time and resources) to select an optimal heuristic.

---

#### 2. Boundedly Resource-Rational Heuristic with Limited Information
The second formula adjusts the first by considering **limited information** $ i $ about the environment $ E $, derived from direct experience, indirect experience, or evolutionary adaptation:

$$
h^*(s_0, B, i) = \arg \max_{h \in H_B} \left[ \mathbb{E}_{E|i} \left[ \mathbb{E}_{P(\text{result}|s_0, h, E, B)} \big[ u(\text{result}) \big] \right] - \mathbb{E}_{t_h, \rho, \lambda | h, s_0, B, E} \big[ \text{cost}(t_h, \rho, \lambda) \big] \right].
$$

**Key Differences:**

- $$ \mathbb{E}_{E \mid i} $$  : An expectation over the possible environments $ E $ based on the **limited information** $ i $.
- This accounts for uncertainty in the environment, relaxing the assumption that the agent has complete knowledge about $ E $.

- **First Formula**: Optimizes heuristic choice assuming full knowledge of the environment.
- **Second Formula**: Incorporates limited information about the environment, making it more realistic for real-world decision-making.

Both formulas highlight how **resource-rational heuristics** balance accuracy against cognitive and temporal costs in decision-making.

---




<div style="border: 1px solid #ddd; border-radius: 8px; padding: 16px; background: #f9f9f9; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
  <p><strong>The Five Steps of Resource-Rational Analysis</strong></p>
  <p>Resource-rational analysis is a methodology for modeling cognitive mechanisms by balancing computational constraints and approximation accuracy. The process iteratively refines the model to align predictions with empirical evidence. Below are the five steps:</p>


  <ol>
    <li>
      <strong>Define the Computational-Level Problem:</strong><br>
      Formulate an aspect of cognition as a <strong>problem</strong> and its <strong>ideal solution</strong> at the computational level (functional description).
    </li>
    <li>
      <strong>Hypothesize the Computational Architecture:</strong><br>
      Propose:
      <ul>
        <li>The <strong>class of algorithms</strong> that the brain might use to approximate the solution.</li>
        <li>The <strong>costs</strong> of computational resources required by these algorithms.</li>
        <li>The <strong>utility</strong> of achieving a more accurate solution.</li>
      </ul>
    </li>
    <li>
      <strong>Optimize the Algorithm:</strong><br>
      Identify the algorithm within the proposed class that <strong>optimally trades off</strong> computational resources and approximation accuracy. This step uses formulas like Equation (3) or (4) to derive the optimal heuristic.
    </li>
    <li>
      <strong>Empirical Evaluation:</strong><br>
      Test the predictions of the derived <strong>rational process model</strong> against empirical data to assess its validity.
    </li>
    <li>
      <strong>Refine and Iterate or Stop:</strong><br>
      Address any significant discrepancies by:
      <ul>
        <li>Refining the computational-level theory (Step 1).</li>
        <li>Improving assumptions about the computational architecture and its constraints (Step 2).</li>
        <li>Deriving a more refined model.</li>
      </ul>
      If the assumptions are already realistic and the model sufficiently aligns with data, the process may stop here.
    </li>
  </ol>
  <p><strong>Key Note:</strong><br>
  The analysis can stop at Step 5 even if human performance deviates from predictions, as long as reasonable attempts have been made to model constraints based on available evidence.</p>

<img src="https://d2acbkrrljl37x.cloudfront.net/bumjini-blog/study_post/resource-rational-analysis03.png" width="70%" height="auto" class="styled-image"/>
</div>
