---
layout: distill-reading
language: English
category: Logic
media: Study
bibliography: all.bib
giscus_comments: false
disqus_comments: false
date: 2026-02-17
featured: true
title: 'ACL 2026 Rebuttal'
description: ''
---


## Details on Steering

For clarification of the steering setting, we identify MLP neurons across **all layers** at the termination neuron location using correlation analysis (see equation below). Specifically, we compute the correlation between each neuron's activation and a binary label indicating whether a token corresponds to a termination location. We then apply steering by increasing the magnitude of the **selected neurons for all tokens during generation** to encourage continuation.

In general, steering neurons across all layers is not encouraged due to layer-wise biases between lower and higher layers (close to logits). However, in our setting, we apply a set-difference formulation to remove neurons that are commonly activated across different instruction types. Concretely, we compute: $$(\text{non-termination instruction}) - (\text{termination instruction})$$ which isolates neurons specifically associated with non-termination behavior. As a result, high-correlation neurons attributable to layer-wise biases are filtered out, leaving only differentially activated neurons. This enables stable all-layer steering without explicit layer selection.

## Definition of Correlation 
We measure the correlation between neuron activations and termination locations. 
Specifically, we compute the Pearson correlation between the activation of each neuron and a binary variable indicating whether a token corresponds to a termination position (e.g., **?.!**).

The correlation is defined as:
$$
\mathrm{Corr}(n) =
\frac{\mathbb{E}[(X - \mathbb{E}[X])(Y - \mathbb{E}[Y])]}
{\sqrt{\mathrm{Var}(X)\mathrm{Var}(Y)}}
$$
where $X$ denotes the activation of a specific neuron and $Y$ is the binary label indicating whether the token corresponds to a termination location.
