---
layout: distill
authors: 
    - name: Bumjin Park
      affiliations:
        name: KAIST
bibliography: all.bib
giscus_comments: false
disqus_comments: false
date: 2025-02-06
featured: true
img: assets/img/phd_essay1.jpeg
title: 'PhD Proposal: Cognitive Architecture for Large Language Models'
category: 'AI'
description: 'PhD Proposal: Cognitive Architecture for Large Language Models'
_styles: >
    .table {
        padding-top:200px;
        margin-bottom: 2.5rem
        border-bottom: 2px;
    }
    .p {
        font-size:20px;
        font-weight: 250;
    }
    .styled-image-magnify {
        border-radius: 15px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        margin: 20px auto;
        transition: transform 0.3s ease;
        display: block;
    }
    .styled-image {
        border-radius: 15px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        margin: 20px auto;
        display: block;
    }
    .styled-image-magnify:hover {
        transform: scale(1.2);
    }
    .td .th {
        font-size: 1.10rem;
        font-family: 'Times New Roman', Times, serif;
    }
---

<img src="/assets/img/phd_essay1.jpeg" width="80%" height="auto" class="styled-image"/>


> 이 글은 ChatGPT로 저의 [PhD Proposal](https://1drv.ms/b/c/ae042a624064f8ca/EVrPSO_rgSpOoyd_4wZ6iqYBayvpz2xXfPnSf0Y7cgAgRw) 을 요약한 것 입니다. 

# 인공지능과 인간 사고의 접점: 인지 아키텍처와 대형 언어 모델의 융합

## AI의 한계를 극복하기 위한 접근

인공지능(AI)은 인간의 사고를 모방하는 수준을 넘어, 인간의 인지 과정 자체를 깊이 연구하는 단계에 이르렀다. 그러나 대형 언어 모델(LLM)은 여전히 몇 가지 근본적인 한계를 가지고 있다. 이 연구에서는 **인지 아키텍처(Cognitive Architectures, CA)**를 LLM에 결합하여 이러한 한계를 해결하는 방안을 제안한다.

---

## 인지 아키텍처란 무엇인가?

인지 아키텍처는 인간의 인지 과정을 모듈화하여 설계한 시스템으로, 다음과 같은 요소로 구성된다.

- **작업 기억(Working Memory)**: 단기적인 정보 유지 및 처리
- **절차적 규칙(Procedural Rules)**: 행동 및 의사결정 과정의 규칙화
- **선언적 기억(Declarative Memory)**: 사실적 정보 및 개념 저장

기존의 LLM은 대규모 데이터 기반 학습을 통해 패턴을 예측하지만, 논리적 추론 능력과 장기 기억 유지에 한계가 있다. 반면, CA는 보다 체계적인 사고 과정을 모방하는 데 초점을 맞춘다. 이 연구에서는 이러한 CA의 구조적 특성을 LLM과 결합하여 보다 강력한 AI 모델을 구축하는 것을 목표로 한다.

---

## 왜 CA와 LLM을 결합해야 하는가?

### LLM의 주요 한계

1. **기억 구조의 부재**  
   - LLM은 문맥 내에서 정보를 활용하지만, 장기적인 정보 저장 및 참조가 어렵다.

2. **추론 능력의 부족**  
   - 기존 LLM은 확률적 예측에 의존하며, 체계적인 문제 해결 능력이 부족하다.

3. **설명 가능성 부족**  
   - 모델이 특정 결론을 도출한 이유를 명확하게 설명하기 어렵다.

이를 해결하기 위해, **인지 아키텍처 기반의 LLM(Cognitive Architecture for Large Language Models, CALM)**을 제안한다. CA의 구조적 요소를 활용하여 LLM의 한계를 보완하고, 보다 논리적이며 투명한 AI 시스템을 구축하는 것이 목표이다.

---

## CALM의 핵심 개념

이 연구는 다음과 같은 세 가지 핵심 질문을 다룬다.

1. **LLM과 CA는 어떻게 상호작용할 수 있는가?**  
   - CA를 통해 LLM의 추론 과정에 개입하고 조정하는 방법을 연구한다.

2. **상징적(Symbolic)과 비상징적(Subsymbolic) 표현을 어떻게 통합할 것인가?**  
   - 인간의 사고 과정에서는 논리적(상징적) 사고와 직관적(비상징적) 사고가 함께 작용한다. 이를 AI에 적용하는 방안을 탐색한다.

3. **인지 모듈은 어떤 역할을 하며, 어떻게 학습될 수 있는가?**  
   - 기억, 추론, 의사결정 등의 기능을 담당하는 개별 모듈을 어떻게 설계하고 학습할지를 연구한다.

이 연구에서는 CA를 LLM 내부에 완전히 결합하는 것이 아니라, 특정 지점에서 개입하는 방식을 고려한다. **토큰 수준에서의 개입(Shallow Integration)**과 **신경망 가중치 수준에서의 개입(Deep Integration)**을 구분하여 연구한다.

---

## AI 연구의 미래: 인간과의 협력

이 연구는 AI가 단순한 패턴 인식 도구를 넘어, 보다 체계적인 사고 능력을 갖추도록 하는 것을 목표로 한다. 특히 다음과 같은 점에서 연구의 의미를 찾을 수 있다.

- **설명 가능한 AI(XAI) 구현**  
  - AI가 내리는 결정을 보다 명확하게 설명할 수 있도록 함

- **강력한 추론 능력**  
  - 단순한 패턴 인식이 아니라 체계적인 논리적 사고를 수행하도록 설계

- **장기적인 AI 발전 방향 제시**  
  - AI가 인간과 협력하여 복잡한 문제를 해결할 수 있도록 발전 방향을 모색

결국 이 연구는 AI가 단순한 도구를 넘어 **인간과 협력하는 지능적 시스템으로 발전**하는 길을 모색하는 데 기여할 것이다.
