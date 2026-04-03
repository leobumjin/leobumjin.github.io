---
layout: distill-reading
bibliography: all.bib
giscus_comments: false
disqus_comments: false
date: 2025-12-28
featured: true
img: assets/img/feigenbaum.png
title: 'Causally Pruned Prober'
category: 'AI'
description: ''
_styles: >
    table {
        padding-top: 200px;
        margin-bottom: 2.5rem;
        border-bottom: 2px;
        width: 120%;
        margin-left: -10%;
        margin-right: -10%;
        table-layout: fixed;
    }
    .table {
        padding-top: 200px;
        margin-bottom: 2.5rem;
        border-bottom: 2px;
        width: 120%;
        margin-left: -10%;
        margin-right: -10%;
        table-layout: fixed;
    }
    .p {
        font-size: 20px;
        font-weight: 250;
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
    td, th {
        font-size: 1.10rem;
        font-family: 'Times New Roman', Times, serif;
    }
---

Causally Pruned Prober: Towards Sparse Linear Probing in Transformers


- **Concept Neuron & Noise Neuron**
- **Weak Concept Neuron & Strong Noise Neuron Definition** 
- **Pruned Prober**
- **Causality as an Additional Condition for Pruned Prober**



---

- 본 논문은 Transformer MLP에 대한 **linear probing의 학습 원리와 작동 메커니즘**을 이해하기 위해,  
  MLP output 공간에서의 concept direction 탐지와 MLP hidden 뉴런 공간에서의 probing 사이의 연결고리를 이론적으로 정립한다.  
  이를 통해 output-level linear probing이 hidden-level neuron probing으로 환원될 수 있음을 보인다.

- 컨셉 뉴런의 탐지를 **noise neuron 제거 문제**로 재해석함으로써,  
  sparse prober를 설계하기 위한 정량적 기준과 원칙을 제시한다.  
  이는 단순히 활성화가 큰 뉴런을 선택하는 접근과 구별되는, 해석 가능하고 목적 지향적인 sparsity의 근거를 제공한다.

- 제안하는 sparse prober는 기존의 다양한 neuron ranking 방법들에 비해,  
  **불필요한 뉴런 제거(neuron ablation)** 과제에서 더 높은 AUROC 성능을 보이며,  
  concept-relevant neuron을 선별하는 데 있어 실질적인 우수성을 입증한다.

- 또한 sparse prober의 한계와 적용 범위를 명확히 논의함으로써,  
  단순한 activation 상관관계 포착을 넘어 **prober의 역할을 확장할 수 있는 향후 연구 방향**을 제시한다.

- Sparse prober는 뉴런이 **국소적(local) 개념을 부분적으로 담지할 수 있음**을 강조한다.  
  최근 distributed representation 관점에서는 회전 불변성이나 sparse dictionary learning을 통해 의미를 해석해야 한다는 주장이 제기되고 있으나,  
  Transformer를 **key–value memory와 residual stream에 대한 read/write 메커니즘**으로 해석할 경우,  
  개념의 형성과 탐지에 기여하는 **sparse하게 작동하는 뉴런을 명시적으로 식별하는 문제는 여전히 중요하다**.

- Transformer에서 선형 prober를 넘어선 non-linear prober는,  
  무작위에 가까운 레이블에도 쉽게 학습되는 것으로 알려져 있다.  
  따라서 뉴런과 레이블 간의 실제 상관관계를 이해하기 위해서는,  
  **선형 모델을 통해 해석 가능성을 최대한 보존하는 접근이 필요하다**.  
  다만 학습 관점에서 보면 모든 뉴런을 포함하는 linear probing이 성능 면에서는 유리할 수 있다.  
  그러나 **뉴런이 활성화되었다는 사실이 곧 모델 내부에서 실제로 사용되었음을 의미하지는 않는다**.  
  이에 본 논문은 뉴런의 실사용 여부를 반영하기 위해,  
  **causality를 고려한 weighting**이 중요도 추정에 효과적임을 논의한다.

- Transformer의 key–value memory 관점에서 MLP output에 대해 선형 prober를 학습하는 것은,  
  해당 뉴런들의 활성화를 통해 **residual representation에 기록되는 방향(direction)** 을 탐지하는 일반화된 과정으로 해석할 수 있다.  
  다시 말해, MLP output 공간에서의 linear probing은  
  MLP hidden 뉴런들의 활성화에 대한 probing으로 재구성될 수 있다.  
  더 나아가, MLP output에서 concept direction을 학습하는 과정은  
  hidden 뉴런들의 **positive/negative 기여도**와,  
  각 뉴런이 활성화될 때 output에 쓰이는 **writing vector의 방향성**을 동시에 고려하는 학습으로 볼 수 있다.  
  이 관찰을 바탕으로, 본 논문은 **causality-aware weighting을 통한 sparse prober 학습 방법**을 제안한다.



----

## Concept Neuron and Noise Neuron

특정 뉴런을 분석할 때, 우리는 다음의 세 가지 요소를 고려할 수 있다.  
(1) 뉴런을 활성화시키는 벡터,  
(2) 입력에 의해 결정되는 활성화 값(activation),  
(3) 뉴런이 출력 공간에서 실제로 사용하는 값(value)이다.

활성화 값은 입력 벡터와 뉴런 가중치 벡터의 연산으로 정의되며, 이는 뉴런이 **얼마나 강하게 켜졌는지**를 나타낸다. 반면, 뉴런의 가중치(또는 value) 벡터는 **어떤 방향의 정보를 출력에 기여하려는지**를 나타낸다. 즉, 활성화는 크기(magnitude), 벡터는 방향(direction)을 담당한다고 볼 수 있다.

이 관점에서 개념 뉴런(concept neuron)은 활성화 값과 방향성의 조합을 통해 정의될 수 있다.

### Concept Direction 기반의 개념 뉴런 정의

개념을 연산적으로 정의하는 방식은 여러 가지가 가능하나, 본 연구에서는 **concept direction**을 기준으로 정의한다. 이에 따르면, 개념 뉴런이란 **특정 개념 방향에 대해 일관되게 기여하는 뉴런**으로 볼 수 있다.

“개념을 쓴다(use)”는 관점에서 보면, 다음 두 조건이 자연스럽게 요구된다.

- 뉴런의 활성화 값은 개념의 존재/부재와 강하게 연관되어야 한다  
- 뉴런의 방향성은 개념 방향성과 강하게 정렬되어야 한다  

### 활성화 조건: 상관 기반 정의

“활성화 값이 충분히 커야 한다”는 조건은, 단순히 활성화의 절대값이 크다는 의미가 아니다.  
이는 **positive 샘플과 negative 샘플에 대해 활성화 값이 개념과 강하게 상관되어야 함**을 의미한다.

개념의 존재 여부를 나타내는 이진 변수 $y \in \{+1, -1\}$ 와  
뉴런 활성화 $a$ 사이의 상관계수 $corr(a, y)$ 가  
$0$에 가깝지 않고, $-1$ 혹은 $1$에 가까운 값을 가져야 한다.

즉,

- $corr(a, y) \approx 1$ 인 경우:  
  개념이 존재할 때 활성화가 커지고, 부재할 때 작아진다
- $corr(a, y) \approx -1$ 인 경우:  
  개념이 존재할 때 활성화가 작아지고, 부재할 때 커진다

두 경우 모두, 활성화는 개념 여부에 대해 **일관된 분리 신호(discriminative signal)** 를 제공한다.

### 방향성 조건: 개념 방향과의 정렬

방향성 조건은 뉴런의 value 벡터 $v$ 와 개념 방향 $d_c$ 사이의 유사도로 정의된다.  
구체적으로, 코사인 유사도

$sim(v, d_c) = \cos(v, d_c)$

가 $0$이 아니라 $-1$ 혹은 $1$에 가까워야 한다.

이는 다음을 의미한다.

- $sim(v, d_c) \approx 1$:  
  뉴런이 개념 방향으로 출력을 **강화**한다
- $sim(v, d_c) \approx -1$:  
  뉴런이 개념 방향을 **일관되게 억제**한다

중요한 점은, 활성화 값이 음수가 될 수 있다는 사실이다.  
이를 고려하면, 활성화의 부호와 방향성의 조합을 통해  
뉴런은 결과적으로 개념 방향에 **동의하거나 반대하는 방식으로 기여**할 수 있다.

### 혼합 관점에서의 개념 뉴런

보다 일반적으로, 뉴런들의 출력은 최종적으로 선형 결합(linear combination)을 통해 사용된다.  
이때 개별 뉴런은 독립적으로 개념을 “표현”한다기보다는,  
**다른 뉴런들과의 혼합과 화합을 통해 특정 개념 방향의 출력을 장려하거나 억제하는 역할**을 수행한다.

이 관점에서 개념 뉴런이란,  
다른 뉴런들과 함께 결합될 때 특정 개념 방향으로의 출력을  
**일관되게 밀어주는 방향성 편향(bias)** 을 제공하는 뉴런으로 이해할 수 있다.

### Noise Neuron의 정의

반대로, 다음과 같은 특성을 가지는 뉴런은 개념 형성에 방해가 될 수 있다.

- 활성화 값과 개념 라벨 간의 상관이 약하여  
  $corr(a, y) \approx 0$ 에 가깝고
- 뉴런의 방향성과 개념 방향 간의 유사도가 낮아  
  $sim(v, d_c) \approx 0$ 이며
- 다른 뉴런들과의 결합 과정에서 개념 방향으로의 출력을  
  일관되게 강화하지 못하는 경우

이러한 뉴런은 개념을 표현하거나 사용하는 데 기여하지 않으며,  
개념 방향에 대해 **무작위적 혹은 불안정한 영향을 미치는 노이즈 뉴런(noise neuron)** 으로 볼 수 있다.


개념 뉴런은  
활성화 값과 개념 라벨 간의 **높은 절대 상관관계**와,  
뉴런 방향성과 개념 방향 간의 **높은 절대 정렬도**를 동시에 만족하는 뉴런이다.

반면, 노이즈 뉴런은  
이 두 조건 중 어느 쪽에서도 일관된 신호를 제공하지 못하는 뉴런이다.

이러한 정의는 모델이 개념을 “사용한다”는 연산적 관점을 유지하면서도,  
개념 뉴런과 노이즈 뉴런을 체계적으로 구분할 수 있는 기반을 제공한다.

개념 뉴런을 정의하기 위해서는 단일 조건만으로는 충분하지 않으며,  
활성화의 상관성, 방향성 정렬, 안정성 등 **여러 조건들이 동시에 고려**되어야 한다.  
이러한 조건들은 논리적으로 결합될 수 있으며,  
개념 뉴런을 정의하는 방식에는 다음과 같은 **두 가지 implication 구조**가 존재한다.


----

## Weak Concept Neuron and Strong Noise Neuron Definition

특정 뉴런이 하나의 **개념(concept)** 을 표현하는지 여부를 판단하기 위해, 우리는 해당 뉴런이 만족해야 할 조건들의 논리적 구조를 어떻게 설정할 것인지 고려할 수 있다. 이때 개념 뉴런을 정의하는 방식에는 다음과 같은 두 가지 논리적 접근이 존재한다.

1. Disjunction of Conditions $\Rightarrow$ Concept Neuron  
2. Concept Neuron $\Rightarrow$ Disjunction of Conditions  

두 접근 모두 개념 뉴런과 조건들 사이의 관계를 기술하지만, 정의의 **강도(strength)** 와 **정밀성(granularity)** 에서 중요한 차이를 가진다.


### 1. Strong Definition: Conditions $\Rightarrow$ Concept Neuron

첫 번째 방식은 특정 조건들의 논리적 결합이 만족될 때, 해당 뉴런을 개념 뉴런으로 **규정하는 방식**이다. 예를 들어,

(Strong)  
$(\text{Activation} > 0.3 \;\lor\; \text{DirectionAlignment} > 0.5) \Rightarrow \text{ConceptNeuron}$

이 정의에서는 개념 뉴런 여부가 **조건들의 논리 구조에 의해 직접 결정**된다. 따라서 조건 간 관계를 매우 정밀하게 설계해야 하며, 다음과 같은 문제가 발생한다.

- $\text{Activation} > 0.3$ 이지만 $\text{DirectionAlignment} \le 0.5$ 인 경우도 개념 뉴런인가?
- 두 조건 중 하나만 만족해도 충분한가, 아니면 동시에 만족해야 하는가?
- 조건 간 상대적 중요도는 어떻게 반영할 것인가?

즉, 조건의 세부 설정이 곧 개념 정의 그 자체가 되며, 정의가 경직되거나 임의적으로 될 위험이 있다.


### 2. Weak Definition: Concept Neuron $\Rightarrow$ Conditions

두 번째 방식은 관점을 반대로 취한다. 개념 뉴런을 **선험적으로 가정**하고, 그러한 뉴런이라면 *적어도* 어떤 조건들 중 하나는 만족해야 한다고 서술한다.

(Weak)  
$\text{ConceptNeuron} \Rightarrow (\text{Activation} > 0.3 \;\lor\; \text{DirectionAlignment} > 0.5)$

이 정의는 개념 뉴런에 대해 **필요조건(necessary condition)** 만을 부여한다. 즉,

- 개념 뉴런이라면 활성화 크기나 방향 정렬 중 하나는 의미 있는 신호를 보여야 한다
- 어떤 조건이 *어떤 방식으로* 충족되는지는 강제하지 않는다

따라서 이는 개념 뉴런에 대한 **약한 정의(weak definition)** 이며, 개념 표현의 다양성과 비결정성을 허용한다.


### 3. Contrapositive: Strong Noise Neuron Definition

약한 개념 뉴런 정의의 핵심은 **대우(contrapositive)** 에 있다.

$\text{ConceptNeuron} \Rightarrow (A \lor B)$  
$\iff \neg (A \lor B) \Rightarrow \neg \text{ConceptNeuron}$

이를 조건에 대입하면,

$\neg(\text{Activation} > 0.3 \;\lor\; \text{DirectionAlignment} > 0.5) \Rightarrow \text{NoiseNeuron}$

이는 다음을 의미한다.

- 모든 조건을 동시에 만족하지 못하는 뉴런은 개념 뉴런일 수 없다
- 개념 뉴런 정의는 약하지만, 노이즈 뉴런 정의는 매우 강하다


### 4. Implications: Precision-Oriented Filtering

이 정의 구조는 **비대칭적(asymmetric)** 이다.

- Concept Neuron: 약한 필요조건 기반 정의
- Noise Neuron: 강한 배제 조건 기반 정의

조건의 개수가 증가할수록,

$\neg (C_1 \lor C_2 \lor \dots \lor C_n) \Rightarrow \text{NoiseNeuron}$

의 적용 범위가 넓어지며, 이는 false positive를 줄이고 **precision 중심의 뉴런 필터링**을 가능하게 한다.

결과적으로, 본 접근은  
**Weak Concept Neuron Definition + Strong Noise Neuron Filtering**  
이라는 구조를 통해 해석 가능성과 안정성을 동시에 확보한다.

---

## Pruned Prober

선형 Prober는 주어진 입력에 대해,  
학습 데이터로부터 **일반화 가능한 선형 분류기**를 학습하는 것을 목표로 한다.  
L1 정규화, Logistic Regression 등은  
정규화 방식이나 최적화 절차, 데이터 분포에 대한 가정에서 차이를 가지지만,  
공통적으로는 다음 성질을 만족하는 방향을 찾는다.

- positive 샘플과는 최대한 **같은 방향**으로 정렬되고
- negative 샘플과는 **반대 방향**으로 정렬되는 weight 벡터

즉, 선형 Prober의 weight는  
개념 분리를 위한 **결과적 표현(resulting representation)** 으로 해석된다.

### Pruned Prober의 기본 아이디어

Pruned Prober는 선형 Prober와 달리,  
뉴런의 표현을 *학습으로 조정*하기보다는  
**전체 뉴런 집합 중 어떤 뉴런을 사용할 것인가를 선택(select)** 하는 데 초점을 둔다.

구체적으로, 전체 뉴런 집합에 대해 가중치 벡터 $w$를 두고,  
사전에 정한 threshold $\tau$를 기준으로 뉴런을 다음과 같이 분할한다.

- $\mathbb{I}(w \ge \tau)$: 선택된 뉴런
- $\mathbb{I}(w < \tau)$: 제거된 뉴런

즉, Pruned Prober는  
연속적인 weight 최적화 문제가 아니라,  
**뉴런 선택을 위한 이진적 필터링 구조**를 가진다.

이후, 선택된 뉴런들에 대해서만  
모델 파라미터 $\theta$를 학습하여  
학습 데이터에 대한 최적의 fitting을 찾는 것을 목표로 한다.

### Weight와 Optimization에 대한 관점

Pruned Prober에서도 다음과 같은 대안적 설계는 가능하다.

- $w$를 초기값으로 두고 $\theta$를 학습하는 방식
- $w$ 자체를 학습하며 뉴런 선택과 분류를 동시에 수행하는 방식

그러나 최적화 관점에서 보면,

- 초기화에 따라 학습 결과가 크게 달라질 수 있으며
- 조건(condition)의 수가 증가할수록  
  선택된 뉴런 집합이 편향되어  
  전체 데이터 분포가 심하게 왜곡되고
- 결과적으로 학습 성능이 오히려 저하되는 문제가 발생할 수 있다

### Pruned Prober의 역할 정리

이러한 이유로, 본 연구에서 Pruned Prober는

- 각 뉴런에 대해 가중치를 부여하여  
  **뉴런을 선택하거나 제거하는 역할만을 수행**하며
- 선택된 뉴런 집합 위에서의 학습 성능 향상을 위해  
  추가적인 튜닝이나 표현 학습에는 사용하지 않는다

즉, Pruned Prober는  
학습을 잘하기 위한 모델이라기보다는,  
**개념과 무관한 뉴런을 제거하여 표현 공간을 정제하는 도구**로 이해된다.




---

## Causality as an Additional Condition for Pruned Prober


본 연구에서 **causality**는 개념 뉴런을 정의하거나 탐지할 때  
사후적으로 분석되는 성질이 아니라,  
**뉴런 탐지 과정에 직접 포함되는 추가 조건(additional condition)** 으로 취급된다.  

즉, 개념 뉴런이란  
활성화-개념 상관성, 방향성 정렬과 같은 정적 조건뿐만 아니라,  
**해당 뉴런의 활성화가 이후 레이어들의 계산에 실제로 영향을 미치는지**라는  
동적 조건을 함께 만족해야 한다.

### Causality Condition

인과성 조건은 다음과 같이 해석될 수 있다.

- 특정 뉴런의 활성화 변화가  
  상위 레이어의 residual stream, attention matrix, 혹은 MLP 표현에  
  **측정 가능한 변화를 유도하는가**
- 이러한 변화가 개념 방향성의 증폭 또는 억제와  
  일관되게 연결되는가

즉, causality는  
“이 뉴런이 개념과 관련 있다”가 아니라,  
“이 뉴런이 없으면 개념 구현이 달라지는가”라는 질문에 대한  
정량적 기준으로 작동한다.

### Pruned Prober: Condition-based Neuron Filtering

이를 위해, 본 연구에서는 먼저  
여러 조건들을 기준으로 뉴런을 **선별적으로 필터링**하는 구조를 도입하며,  
이러한 조건 기반 뉴런 선택 메커니즘을 **Pruned Prober**라고 명명한다.

Pruned Prober는 다음과 같은 특징을 가진다.

- 뉴런 선택은 하나의 점수나 단일 기준이 아니라,  
  여러 조건들 $\{C_1, C_2, \dots, C_n\}$ 의 논리적 결합에 의해 이루어진다
- 각 조건은 뉴런이 개념 구현에 기여할 *가능성* 또는 *필요성*을 제한한다
- 결과적으로, 노이즈 뉴런을 제거하고  
  개념과 무관한 자유도를 축소한 서브스페이스를 형성한다

### Causally Pruned Prober (CPP)

특히, 노이즈를 제거하기 위한 조건들 중에  
**causality 조건이 명시적으로 포함되는 경우**,  
이를 **Causally Pruned Prober (CPP)** 라고 정의한다.

즉,

- Pruned Prober:  
  활성화 상관, 방향성 정렬 등 **정적 조건들**에 기반한 뉴런 필터링
- Causally Pruned Prober (CPP):  
  위 조건들에 더해,  
  뉴런의 활성화가 **추후 레이어들에 미치는 인과적 영향**을  
  필터링 조건으로 포함한 경우

CPP는 단순히 “개념과 닮은 뉴런”이 아니라,  
**개념 구현에 인과적으로 관여하는 뉴런만을 남기는 구조**를 목표로 한다.

### Summary

요약하면,

- Causality는 개념 뉴런 탐지에 **추가되는 핵심 조건**이며
- 이 조건은 뉴런의 활성화가  
  이후 레이어의 계산과 개념 구현에 미치는 영향을 기준으로 정의된다
- 여러 조건에 기반해 뉴런을 필터링하는 구조를 **Pruned Prober**라 부르며
- 그중 causality 조건을 포함하는 특수한 경우를  
  **Causally Pruned Prober (CPP)** 라고 정의한다

이 구분은 개념 뉴런 탐지를  
통계적 연관성에서 **구조적·인과적 해석**의 수준으로 확장하는 기반을 제공한다.