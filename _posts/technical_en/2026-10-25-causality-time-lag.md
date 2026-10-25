---
layout: post
title: "Causality Appears with a Time Lag"
permalink: /blog/2026/causality-time-lag-en/
mini-title: "Causality & Time"
---

One figure in Judea Pearl and Dana Mackenzie’s *The Book of Why* stayed with me. It places US per capita cigarette consumption beside male lung cancer mortality. Consumption rises and falls first; mortality follows a similar broad trajectory decades later.

<figure class="causal-lag" data-lang="en">
  <div class="causal-lag-legend"><span class="causal-smoking">Cigarette consumption</span><span class="causal-mortality">Male lung cancer mortality</span></div>
  <div class="causal-lag-scroll"><svg viewBox="0 0 800 420" role="img" aria-labelledby="causal-title causal-desc"><title id="causal-title">Causality Appears with a Time Lag</title><desc id="causal-desc">Cigarette consumption rises and falls before lung cancer mortality follows a similar trend decades later.</desc></svg></div>
  <div class="causal-lag-controls" hidden><label for="causal-shift">Shift the cigarette consumption curve to the right: <output id="causal-years" for="causal-shift">0</output> years</label><input id="causal-shift" type="range" min="0" max="40" value="0" step="1"><button type="button" id="causal-reset">Reset</button></div>
  <noscript>Enable JavaScript to display the chart. Consumption peaks first; lung cancer mortality peaks decades later.</noscript>
  <figcaption>Illustrative reconstruction of the supplied figure’s broad trends, not raw data or exact annual observations. The vertical axes have different units; equal heights do not mean equal effect sizes.</figcaption>
</figure>

## Time between cause and effect

What stands out is the distance in time between the curves. A change in a cause and a change in its outcome need not appear in the same year. Even after cigarette consumption starts falling, lung cancer mortality continues rising for a while. Present outcomes can carry the effects of past exposure.

Moving the consumption curve roughly thirty years to the right makes the resemblance easier to see. The curves still do not match exactly. The shift is a visual way to think about delayed effects, not a claim that everyone has the same latency or that mortality reproduces consumption at a fixed scale.

## From a similar pattern to a causal question

A similar pattern with a time lag does not, by itself, establish causality. Other factors could influence both series. These are population trends, so the chart also cannot directly tell us an individual’s risk or exact latency.

The causal question goes further: **If we had intervened to reduce smoking, how would subsequent lung cancer deaths have changed?** Answering that requires assumptions about confounding, individual-level studies, biological explanations, and evidence across studies, alongside the visual pattern.

What I want to remember from this figure is that an effect may already be developing before it becomes visible. A short observation window can hide the traces of a cause. Thinking causally means asking both what changed and when its consequences would appear.

## Source

Judea Pearl & Dana Mackenzie. *The Book of Why: The New Science of Cause and Effect*. Basic Books, 2018. [ Official book page ](https://bayes.cs.ucla.edu/WHY/index.html).

An example of the underlying smoking research: Richard Doll & A. Bradford Hill (1956), [Lung Cancer and Other Causes of Death in Relation to Smoking](https://www.bmj.com/content/2/5001/1071), *BMJ*.

<link rel="stylesheet" href="{{ '/assets/css/causal-lag.css' | relative_url }}">
<script src="{{ '/assets/js/posts/causal-lag.js' | relative_url }}" defer></script>
