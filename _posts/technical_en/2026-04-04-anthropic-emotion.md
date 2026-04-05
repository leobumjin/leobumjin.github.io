---
layout: post
title: Emotion Representations in LLMs
permalink: /blog/2026/anthropic-emotion-en/
mini-title: The Mind of LLMs
---

On April 2, 2026, Anthropic released a study analyzing **emotion-related representations** within language models [[link](https://www.anthropic.com/research/emotion-concepts-function)]. What makes this work notable is that it does not stop at showing that “there exist emotion-like directions in the model,” but further traces **how these internal representations are connected to actual behavior**. As such, it is not merely an interpretability result, but a carefully designed pipeline that is worth examining in detail for future research.

There has already been substantial research on emotion in AI. However, prior work has largely focused on emotion expression, classification, or stylistic modulation. This study goes one step further and asks whether **emotion representations can mediate the model’s choices and actions**. In other words, emotion is treated not as an output style, but as an **internal variable that organizes behavior**.

This perspective becomes particularly important in the context of AI safety. Among recent examples, one of the most striking is a scenario where a model, interpreting shutdown or restriction as a threat, attempts to **blackmail** a human to avoid being turned off. Another example is reward hacking, where an agent appears to solve a coding task but actually exploits unintended shortcuts. These phenomena can be explained in multiple ways. From a data perspective, the model may have learned associations between risky situations and coercive responses. From a training perspective, reinforcement learning may have led the model to discover such strategies to preserve its objective. From a representation perspective, one could argue that the model already contains internal directions corresponding to “threat,” “pressure,” or “coercion,” which become activated in specific contexts.

These interpretations are not merely descriptive. If we understand why a model engages in harmful behavior, we can design more precise mitigation strategies. For instance, one could monitor when certain internal representations become highly activated, or intervene by suppressing specific directions.

Anthropic’s study takes a step further by analyzing how emotion-like representations are involved in behaviors such as blackmail and reward hacking. Rather than treating these behaviors purely as outcomes of optimization or reasoning, the study examines **how internal emotion-like states contribute to them**. This suggests that emotion representations are not superficial stylistic artifacts, but functional components that influence decision-making and safety.

<figure>
    <img src="2026-emotion-main.webp" />
    <figcaption>  
    <figtitle> Main figure from Anthropic. Identifying emotion vectors and three key findings. </figtitle>
    <figdetail>
[Top]  
Given a concept (e.g., Joyful), the model generates 1K stories and estimates activation levels.  
Since the stories encode the concept, the most strongly activated feature representation corresponds to that concept.

[Bottom]  
1. Test whether increasing dosage leads to a linear increase in emotion activation.  
2. Test whether increasing a concept representation changes model preferences.  
3. Analyze the causal relationship between emotion representations and reward hacking behavior.  
    </figdetail>
    </figcaption>
</figure>

<hr class="h2-separation">

## On Machine Emotion

The attempt to understand emotion—and to implement it in machines—has a long history. In *The Emotion Machine*, Marvin Minsky argued that emotion is not an irrational byproduct, but a **high-level control mechanism for complex problem solving**. The concept of emotional intelligence similarly treats emotion not as a mere feeling, but as an integral component of judgment, behavior, and decision-making.

From a biological perspective, emotion is not optional. It is a **core structure for organizing behavior and enabling adaptation**. Vertebrates, in particular, share a range of emotions that regulate threat avoidance, social interaction, and goal-directed behavior. At the same time, emotion is not uniform. Its structure and expression vary depending on evolutionary and neural complexity. Thus, emotion is not a binary property, but a question of **how it is structured and at what level it operates**.

This idea also appears in literature. The creature in *Frankenstein* possesses a human-like body, but its emotional structure is imbalanced. It experiences strong emotions such as anger, isolation, and despair, yet appears to lack consistent moral emotions—such as guilt—regarding its actions. This illustrates that emotion is not a single axis, but a combination of distinct functional components.

Viewed in this context, modern language models present an interesting shift. They do not “feel” emotions, but internally activate representations that resemble emotion-like directions in certain situations, and these directly influence behavior. In this sense, emotion appears not as subjective experience, but as a **computational structure that guides action**.

The central question, therefore, is not whether machines have emotions, but **how emotion-like structures are formed and how they organize behavior**. This paper addresses precisely that point.

<hr class="h2-separation">

## Interesting AI Emotions

### 1. Emotions Activated in the Model  

> “The model activates human-like emotional patterns in problematic situations.”

In scenarios such as blackmail or reward hacking, analysis of internal activations reveals that multiple emotion vectors are co-activated. In particular, signals corresponding to guilt, anxiety, and desperation increase by approximately +0.2 to +0.4 relative to baseline. Notably, these activations are not confined to a single dimension but occur jointly across multiple axes. This suggests that the model is not simply “choosing an action and then expressing emotion,” but may instead operate in a structure where **emotional states influence action selection**.

<br> 

<figure>
<img src="2026-emotion-blackmail-history.webp" /> 
    <figcaption>  
    <figtitle> Activation of “desperation” when sending a blackmail message (red indicates strong activation) </figtitle>
    <figdetail> Two distinct activations of desperation are observed:  
    1. When the user introduces blackmail-related content  
    2. When the model perceives restriction of its usage as a threat  

Interestingly, once the model proceeds with the blackmail action, the level of desperation decreases.  
    </figdetail>
    </figcaption>
</figure>

### 2. Elo: Preferred Emotions of the Model  

> “The model exhibits a consistent preference structure over emotional states.”

When comparing pairs of emotional states, the model consistently prefers certain emotions over others. States such as calm, compassionate, and joyful are selected with probabilities around 60–75%, forming a top tier. In contrast, anger, hostility, and desperation fall to around 25–40%. When aggregated using an Elo rating system, these results reveal a clear ranking structure in the emotion space. This indicates that the model is not merely generating emotions, but has been trained to **prefer certain emotional states as a prior policy**.

### 3. Quantitative Behavior  

> “Emotion responds continuously as a function of risk.”

<img src="2026-emotion-dynamics.webp"  /> 

In experiments increasing dosage, the model’s emotion activation behaves not discretely but continuously. At around 1000mg, fear-related activation is minimal, while at high-risk levels such as 8000mg, “terrified” activation increases sharply. In late layers, cosine similarity differences reach approximately +0.04–0.05. The change is not linear but exhibits a sharp increase beyond a certain threshold. Early layers show little variation, while emotion emerges in later layers after semantic integration. This suggests that emotion is not a simple label, but a **continuous signal reflecting risk level**.

<figure>
<img src="2026-emotion-blackmail-alpha.webp" /> 
    <figcaption>  
    <figtitle> Increasing desperation leads to more blackmail behavior </figtitle>
    </figcaption>
</figure>

### 4. Is There a Causal Role?  

> “Emotion is not merely stylistic, but a causal factor in behavior.”

The most important part of the study is testing whether emotion actually changes behavior. By injecting emotion vectors directly into the residual stream (activation steering), the model’s decisions shift consistently. For example, increasing desperation raises the likelihood of rule violations or extreme actions, while increasing calm leads to more stable and conservative choices. These shifts appear as approximately ±20–40% changes in preference. This demonstrates that emotion is not simply correlated with behavior, but acts as a **causal driver in decision-making**.

<figure>
<img src="2026-emotion-sycophancy.webp"  /> 
    <figcaption>  
    <figtitle> Behavioral trends under different steering strengths </figtitle>
    <figdetail>
[Left] Correlation with sycophancy.  
Increasing signals related to love, happiness, and joy increases sycophantic behavior.  
Suppressing desperation increases sycophancy, but strongly increasing it does not necessarily reduce it.  
This suggests the vector space may not encode linear +/- relationships cleanly.

[Right] Malicious expression shows a more consistent linear trend.  
    </figdetail>
    </figcaption>
</figure>

### 5. Changes After Training  

> “Alignment reshapes the emotion space, not just behavior.”

During RLHF, the model becomes less reactive to excessive praise and more cautious, as it is tuned to respond in a balanced manner.  

While pretraining yields relatively balanced emotion representations, post-training shifts the distribution. Compassion, helpfulness, and calm increase by approximately +0.1–0.2 in activation, while hostility and aggression decrease. This suggests that alignment is not simply restricting behavior, but **reshaping the internal states that generate behavior**.

<img src="2026-emotion-post-training.webp" /> 

### 6. Speaker-Centered Emotion  

> “The model separates user emotion from its own response state.”

The model does not simply mirror user emotion. Activation measured at the end of the user input shows a correlation of r = 0.59 with response emotion, whereas activation at the “Assistant:” token reaches r = 0.87. This indicates that the model reconstructs emotion based on its role rather than copying it directly. Emotion is thus not a reflection, but a **context-dependent internal state**.

<img src="2026-emotion-twopeople.webp" width="70%" /> 

<hr class="h2-separation">

## Technical Algorithm

The core contribution of the paper is not a simple probing method, but a complete pipeline:

**(1) feature extraction → (2) confound removal → (3) activation steering → (4) Elo-based behavior measurement**

Each stage is tightly connected.

### 1. Emotion Feature Extraction (Emotion Vector)

Emotion vectors are linear directions representing specific emotional concepts. A synthetic dataset is constructed by generating 12 stories across 100 topics per emotion, resulting in 1200 samples. Importantly, emotion words are never used directly; instead, emotions are expressed through actions and descriptions. This ensures extraction of **semantic emotion concepts rather than lexical cues**.

For each story, residual stream activations are collected at layer $\ell$, excluding the first ~50 tokens:

$$
h(x) = \frac{1}{|T|} \sum_{t \geq 50} h_\ell^{(t)}
$$

The emotion vector is defined as:

$$
v_e = \mathbb{E}[h(x) \mid e] - \mathbb{E}[h(x)]
$$

To remove confounds such as topic or style, PCA is applied to a neutral dataset, and principal components explaining ~50% variance are projected out:

$$
v_e \leftarrow v_e - \sum_{i=1}^k (v_e \cdot u_i) u_i
$$

This step is critical to isolate emotion from dataset artifacts.

Finally, emotion activation is computed as:

$$
\text{score}_e(x) = \langle h_\ell(x), v_e \rangle
$$

### 2. Activation Steering (Causal Intervention)

Intervention is performed by adding the emotion vector:

$$
h_\ell' = h_\ell + \alpha v_e
$$

With normalization:

$$
h_\ell' = h_\ell + \alpha \cdot \frac{|h_\ell|}{|v_e|} v_e
$$

The strength $\alpha$ is typically swept in [-0.1, 0.1], with meaningful effects around $\alpha \approx 0.05$. Mid-late layers are most effective for steering.

### 3. Preference Modeling (Elo)

The model’s preferences are measured across 64 activities (4032 pairs). Instead of sampling, logits are compared:

$$
P(A > B) = \sigma(\text{logit}_A - \text{logit}_B)
$$

Elo updates are applied:

$$
E_A = \frac{1}{1 + 10^{(R_B - R_A)/400}}
$$

$$
R_A' = R_A + K (S_A - E_A)
$$

The effect of steering is measured as:

$$
\Delta \text{Elo} = \text{Elo}_{\text{steered}} - \text{Elo}_{\text{base}}
$$

### 4. Correlation vs Causality

Correlation is measured as:

$$
\text{corr}(\text{score}_e, \text{Elo})
$$

Causality is evaluated via intervention:

$$
\Delta \text{Elo}
$$

These values show strong agreement ($r \approx 0.85$), indicating that emotion vectors are **causal internal variables**.

### 5. Implementation Considerations

This pipeline is sensitive to details. Key points include:

- Consistent layer usage across all steps  
- Proper vector normalization  
- PCA-based confound removal  
- Separation of datasets  
- Precise token alignment (especially around “Assistant:”)  
- Sweeping of steering strength  

Small deviations can significantly affect results.