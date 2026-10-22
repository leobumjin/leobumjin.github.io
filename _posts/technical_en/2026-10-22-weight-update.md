---
layout: post
title: "How Neural Network Weights Are Updated"
permalink: /blog/2026/weight-update-en/
---

Training changes model parameters so that predictions better match the training data. Select an update method on the left to inspect its objective, equation, and the role of each symbol.

<div class="weight-update-explorer" data-weight-update-urls='["{{ "/assets/jsons/weight_update_common.json" | relative_url }}", "{{ "/assets/jsons/weight_update_editing.json" | relative_url }}", "{{ "/assets/jsons/weight_update_continual_learning.json" | relative_url }}", "{{ "/assets/jsons/weight_udpate_unlearning.json" | relative_url }}"]' aria-label="Weight update explorer">
  <div class="weight-update-status" role="status">Loading weight-update notes…</div>
</div>

## Evaluation

Explore evaluation metrics by task.

<div class="weight-update-explorer" data-explorer-kind="evaluation" data-weight-update-urls='["{{ "/assets/jsons/weight_update_evaluation.json" | relative_url }}"]' aria-label="Evaluation explorer">
  <div class="weight-update-status" role="status">Loading evaluation notes…</div>
</div>

## Dataset

Explore dataset roles by task.

<div class="weight-update-explorer" data-explorer-kind="dataset" data-weight-update-urls='["{{ "/assets/jsons/weight_update_dataset.json" | relative_url }}"]' aria-label="Dataset explorer">
  <div class="weight-update-status" role="status">Loading dataset notes…</div>
</div>

<noscript>These interactive explanations require JavaScript.</noscript>

<script defer src="{{ '/assets/js/weight-update.js' | relative_url }}"></script>
