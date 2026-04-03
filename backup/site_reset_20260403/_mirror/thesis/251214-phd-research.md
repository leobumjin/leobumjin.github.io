---
layout: distill-reading
language: Korean
category: Thesis
media: Research
bibliography: all.bib
giscus_comments: false
disqus_comments: false
date: 2025-12-14
featured: true
title: 'LLM 지식의 변경을 최소한으로 하는 지식 구조'
description: 'What are the basic principles for developing logic.'
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

Framework Problem에서 영감을 받아, 
지식의 충돌과 업데이트가 빈번히 일어나는 AI 시스템을 어떻게 설계하면, 
최소한의 업데이트로 지식의 안정화를 최대화할 수 있는가? 

- 신경망이 지식을 저장하는 방법 
- 신경망들의 표현을 바탕으로 지식을 저장하는 방법등

- LLM의 지식구조 (구조를 밝히는 것은 아님. Interpretability, Circuit이 Main은 아님)
- 지식구조의 변경에 대한 (LLM, 파라미터 업데이트, ROME, MEMIT같은 지식 업데이트 연구인가?) 그럴 수 있어. 
- 지식의 대응에 대한 부분 등이 있어. (추상적인 형태에 대한 건데, 이론적인 구조, 심볼릭과의 연결)

변경에 대한 부분, 대응에 대한 부분이 있지 


----

기본적으로 지식은 충돌적이다. 
참 혹은 거짓으로 유도되는 다양한 길이 존재하고, 선택적으로 추론을 진행한다. 
더 쉬운 방법은 정답을 정해놓고 진행하는 것이다. 
즉 참으로 통하는 증거들만 모으는 것이다.

많은 것들이 존재하기에, 그들 간의 충돌은 자연스럽고, 
신경망도 마찬가지로, 참, 혹은 거짓으로 고려를 하고 있다. 
그 많은 것ㄷ르에 대해서, 안정적으로 추론하는 것은 그 밸런스를 잘 지키고 유지하기 때문인 것으로 보인다. 

분산적으로 저장하는 것과, 
심볼적으로 연산하는 것은 사뭇 다르다. 

LLM에게 심볼적으로 표현을 집어 넣었을 때, 
분산표현적으로 연산을 수행하고, 
결과는 심볼적인 어떤 연산과 대응되도록 기대한다. 


Conflict는 항상 다중적인 것 같은데, 
LLM은 어떻게 문제를 해결하지?
1) Context마다 적절성을 따진다. 

가령 Tweety라는 새가 있다고 하자. 
그럼, Tweety에 관련된 속성들이 있고, 
이를 바탕으로 기존의 추론 경로들을 고려하여, 
결정을 내린다. 


새냐고 묻는 것. 
날 수 있냐고 묻는 것. 
대답은? 


-----
## Properties of Knowledge Conflict 

### 1. Diverse Derivational Paths
For a given proposition, there may exist multiple distinct reasoning paths leading to the same conclusion.  
Knowledge conflict arises when these paths differ in structure, reliability, abstraction level, or length.


### 2. Context-Dependent Truth Assignment
Given a context \( C \), each proposition can be assigned a truth value  
\( v \in \{\text{true}, \text{false}, \text{undetermined}\} \).  
The same proposition may receive different evaluations under different contexts.


### 3. Default / Normality via Context
A proposition is considered *default* or *normal* if it holds across most relevant contexts and is overridden only in exceptional cases.


### 4. Default / Normality via Reasoning Abstraction
If a proposition is supported by multiple independent reasoning paths, it is treated as a normal or robust conclusion.  
Normality emerges from redundancy and abstraction in reasoning, rather than from a single rule.


### 5. Default / Normality via Shortcut (Minimal Derivation)
Among competing reasoning paths, the shortest or least complex derivation is preferred as the default justification.