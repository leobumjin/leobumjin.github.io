---
layout: distill
bibliography: all.bib
giscus_comments: false
disqus_comments: false
date: 2025-11-16
featured: true
img: assets/img/feigenbaum.png
title: 'Scientific Controversies - Deep Thought'
description: "AI는 인간과 어떻게 다를까"
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
---


# Pioneer Works (Deep Thoughts, November 16, 2025)

AI에게 생각이 있을까? **Yes**   
AI는 인간만큼 똑똑할까? **Sort of**

<img src="https://d2acbkrrljl37x.cloudfront.net/bumjini-blog/251116_pioneerworks.jpg" width="50%" height="auto" class="styled-image"/>



인공지능 분야의 대가 [Yann LeCun](https://yann.lecun.com/?utm_source=chatgpt.com)과 Google DeepMind에서 물리학적 관점으로 AI를 연구해온 [Adam Brown](https://research.google/people/108351/?utm_source=chatgpt.com), 그리고 천체물리학자 모더레이터 Janna Levin이 함께한 패널 토론을 늦가을 밤 브루클린의 [Pioneer Works](https://pioneerworks.org/?utm_source=chatgpt.com)에서 들었다. 이 행사는 Pioneer Works의 대표 시리즈인 Scientific Controversies 프로그램 중 하나였고, 이번 주제는 “Deep Thoughts of Artificial Minds”였다 ([reference](https://pioneerworks.org/programs/scientific-controversies-deep-thoughts-of-artificial-minds?utm_source=chatgpt.com)). 뉴욕에서 보기 드문 커뮤니티 중심의 토크였으며, AI가 사람들에게 미치는 영향과 미래에 대한 논의를 깊게 들을 수 있었다.

토론에서는 단순히 “AI가 인간보다 얼마나 뛰어나냐”는 성능 경쟁을 넘어서, 로봇이 인류를 해칠 것인지, AI는 인간과 어떤 점에서 다른지, 앞으로 인공지능 기술을 어느 방향으로 발전시켜야 하는지 같은 근본적인 질문들이 오갔다. Adam은 물리학적 시스템에서 AI 내부적으로 등장하는 emergent behavior를 중요하게 보았다. 그는 AI의 성능은 앞으로도 계속 상승할 것이고, 그 한계는 쉽게 도달되지 않을 것이라고 주장했다. 반면 전통적인 AI의 선구자인 Yann은 LLM이 처리할 수 있는 태스크의 범위에는 구조적 한계가 존재하며, 현재의 LLM 구조로는 현실 세계에 존재하는 다양한 문제를 충분히 해결할 수 없다고 말했다. 다만 Yann이 말한 것은 “LLM이 끝났다”는 뜻이 아니라, LLM 방식으로는 원리적으로 해결하기 어려운 종류의 현실 문제가 존재한다는 점이었다.

**Yann**의 설명은 현실적인 예시를 통해 직관적으로 다가왔다. 그는 인간이나 고양이 같은 생물이 특정 영역에서는 여전히 AI보다 훨씬 뛰어나다고 말했는데, 여기서 고양이가 인간보다 더 똑똑한 부분도 있다는 그의 농담이 있었다. Yann은 뉴런 기반의 생물학적 뇌가 수행하는 연산량이 현재 컴퓨터 하드웨어로 시뮬레이션할 수 있는 수준보다 훨씬 크다고 강조했다. 또한 LLM이 토큰 기반으로 작동하는 구조적 특성 때문에, 연속적이고 다양성이 높은 감각 세계—비디오, 로봇 조작, 물리적 상호작용 등—를 직접 다루는 데 본질적인 한계가 있다고 설명했다. 상업용 로봇이 아직 본격적으로 등장하지 못한 이유 역시, 현실과 직접 소통할 수 있는 센서-지능 결합 구조가 여전히 충분히 개발되지 않았기 때문이라는 것이다.

## 디지털과 현실 

결국 Adam과 Yann은 서로 다른 두 세계를 이야기하고 있었다. Adam은 LLM과 같은 **이산적, 순차적** 표현을 가진 모델이 어디까지 확장될 수 있는지를 논했고, Yann은 현실을 정확하게 다루는 AI가 되기 위해서는 어떤 구조적 변화가 필요한지를 이야기했다. 최근 많은 기관과 기업들이 LLM 중심의 AI에 큰 관심을 쏟고 있고 실제로 사회적인 영향도 상당하기 때문에, Adam은 LLM이 현실 문제를 점점 더 잘 해결해 갈 것이라 본다. 반면 Yann은 LLM이 학습할 수 있는 데이터 구조가 제한적이기 때문에 물리학, 상식 추론, 장기 계획 등 현실을 구성하는 핵심 문제는 LLM으로 해결할 수 없으며 **새로운 패러다임**의 연구가 필요하다고 말한다.

나는 두 사람의 논쟁을 들으며 이것을 **디지털 세계**와 **물리적 세계**의 차이라고 생각했다. 컴퓨터가 만든 세계 안에서는 AI가 스스로 많은 것을 해결해 나갈 수 있다. 그러나 그 세계 밖, 현실과 상호작용하는 순간부터는 변수가 너무 많고, 노이즈와 불확실성이 지배한다. AI는 아직 컴퓨터 바깥의 세계에서 충분히 검증되지 않았으며, 바로 그 점에서 연구의 미래가 열려 있는 것처럼 보였다.

AI 연구는 단순히 성능이 좋은 모델을 만드는 것으로 끝나지 않는다. 인간과의 상호작용을 연구하거나, AI가 사회에 미치는 영향력을 조절하거나, 인간의 본질을 탐구하도록 하는 등 다양한 인간 중심 연구가 존재한다. 연구자들은 각자의 관점에서 탐구하고 비밀을 밝혀가며, 같은 질문에도 서로 다른 방식으로 답한다.


> AI에게 생각이 있을까? Yes.  

> AI는 인간만큼 똑똑할까? Sort of.  

> AI 시대는 Doomsday인가 Renaissance인가? 

> 패널 둘 다 AI 시대는 Renaissance라고 답했다.

## 여담 

여담으로, 모더레이터 Janna는 “이렇게 위험한 기술이 주머니 속에 있는 것이 걱정되지 않냐”고 물었다. 이에 대해 LeCun은 멋진 비유를 들었다. 폭탄 제조 정보를 담은 화학책을 들고 다니는 학생이 위험한 것은 아니며, 책과 AI는 모두 정보를 제공하는 도구일 뿐이라는 것이다. 인류는 그런 책을 들고 다니고 공부하며 지식을 공유하고 발전해왔다. 결국 위험은 인간의 선택에 의해 발생하며, 인류는 언제나 열린 지식을 활용하는 방향으로 진보해 왔다. 우리는 이제 더 빠른 롤러코스터 위에서 스스로의 운명을 결정하고 있고, 이 과정에서 앞으로 무엇이 얼마나 더 발견될지 궁금하다.

