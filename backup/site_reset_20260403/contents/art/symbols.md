---
layout: distill
bibliography: all.bib
giscus_comments: false
disqus_comments: false
date: 2025-11-15
featured: true
img: assets/img/feigenbaum.png
title: 'Symbols'
description: ""
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
    /* 모바일 반응형 스타일 */
    @media (max-width: 768px) {
        d-article {
            padding-left: 1rem !important;
            padding-right: 1rem !important;
            box-sizing: border-box;
        }
        d-article * {
            max-width: 100%;
            box-sizing: border-box;
        }
        d-article p, d-article h1, d-article h2, d-article h3, d-article h4, d-article h5, d-article h6, d-article li, d-article a {
            word-wrap: break-word;
            overflow-wrap: break-word;
        }
        d-article img, d-article iframe, d-article video {
            max-width: 100% !important;
            height: auto !important;
        }
        .pioneer-container {
            padding: 1rem;
        }
    }
    table {
        padding-left: 0;
        padding-right: 0;
        margin-left: 0;
        margin-right: 0;
        border-left: none;
        border-right: none;
    }
    table th, table td {
        padding-left: 0;
        padding-right: 0;
        border-left: none;
        border-right: none;
    }
---


## AI Symbol Table (v0.1)

## Intro: 심볼을 만드는 방법
AI 심볼은 **핵심 의미만 남기고**, **점/선/면의 최소 요소**로 표현한다.  
각 심볼은 다음 원칙을 따른다:

1. **단순성** — 디테일을 제거하고 본질만 표현한다.  
2. **메타포성** — 개념을 가장 잘 연상시키는 기초 기하 형태를 선택한다.  
3. **일관성** — 동일 카테고리는 유사한 형태적 문법을 공유한다.  
4. **추상성** — 실제 구조 그대로 그리지 않고 ‘상징적 형태’로 재구성한다.  

아래는 AI 전 분야를 아우르는 **정식 심볼 테이블**이다.

# Hierarchical Table of LLM Internal Dynamics  



### Activation System  

| Component (Real Term) | Dynamic Action (Process Name) |
|------------------------|--------------------------------|
| **Activation** | Activation Drift / Activation Collapse / Activation Surge / Activation Routing |
| **Neuron** | Neuron Competition / Inhibition Dynamics |
| **MLP Gate** | Gate Opening Dynamics / Gate Collapse / Gating Shift |
| **Layer Norm** | Norm-Induced Stabilization / Norm Shift Compensation |
| **Residual Path** | Residual Flow Merging / Residual Routing Shift |
| **Softmax Distribution** | Softmax Sharpening / Softmax Flattening / Probability Mass Shift |
| **Logit** | Logit Drift / Logit Collapse / Logit Amplification |



### Representation Space 

| Component (Real Term) | Dynamic Action (Process Name) |
|------------------------|--------------------------------|
| **Representation** | Representation Warping / Convergence / Divergence / Collapse / Reconfiguration |
| **Feature Vector** | Feature Fusion / Feature Separation / Feature Drift |
| **Concept Direction** | Concept Drift / Concept Emergence / Concept Separation |
| **Positional Embedding** | Positional Drift / Positional Reweighting |
| **Superposition** | Superposition Collapse / Superposition Mixing / Alignment |


### Attention System  

| Component (Real Term) | Dynamic Action (Process Name) |
|------------------------|--------------------------------|
| **Query Vector** | Query Drift / Query Map Reweighting / Query–Key Convergence |
| **Key Vector** | Key Alignment Dynamics / Key Reorientation / Key Field Distortion |
| **Value Vector** | Value Propagation / Value Integration Flow / Value Mixing |
| **Attention Score** | Score Redistribution / Score Collapse / Score Concentration |
| **Attention Head** | Head Specialization Drift / Head Merge / Head Redistribution |
| **Attention Map** | Map Reconfiguration / Map Collapse / Map Reinforcement |


### Transformation & Routing  

| Component (Real Term) | Dynamic Action (Process Name) |
|------------------------|--------------------------------|
| **Projection (Linear)** | Projection Shift / Projection Realignment / Projection Warping |
| **Routing Path** | Information Routing Shift / Routing Collapse / Dynamic Path Selection |
| **Residual Connection** | Merge Dynamics / Shortcut Shift |


### Memory & Context  

| Component (Real Term) | Dynamic Action (Process Name) |
|------------------------|--------------------------------|
| **Token Representation** | Contextual Drift / Identity Shift / Representation Collapse |
| **Hidden State** | State Transition Dynamics / Hidden-State Decay / Reinforcement |
| **Memory Slot / Cache** | Slot Update Dynamics / Slot Eviction Flow / Slot Reinforcement |
| **Context Window** | Context Compression / Reallocation / Expansion |


### Training Signal & Update  

| Component (Real Term) | Dynamic Action (Process Name) |
|------------------------|--------------------------------|
| **Weight Matrix** | Weight Realignment / Weight Drift / Weight Reparameterization |
| **Gradient** | Gradient Flow / Gradient Suppression / Explosion / Vanishing |
| **Update Rule** | Update Shift / Learning Dynamics Adjustment |