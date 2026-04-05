---
layout: post
title: LLM의 감정 표현 
permalink: /blog/2026/anthropic-emotion-kr/
mini-title: LLM의 감정 
---

2026년 4월 2일, Anthropic은 언어 모델 내부의 표현 벡터들 가운데 **감정과 관련된 representation**을 분석한 연구를 공개하였다 [[link](https://www.anthropic.com/research/emotion-concepts-function)]. 이 연구가 흥미로운 이유는 단순히 “모델 안에도 감정과 비슷한 방향이 있다”는 사실을 보이는 데 그치지 않고, **그러한 내부 표현이 실제 행동과 어떻게 연결되는지**까지 추적했다는 점에 있다. 따라서 이 연구는 단순한 해석 가능성 사례가 아니라, 이후 후속 연구를 위해 어떤 알고리즘과 실험 설계를 사용했는지를 세밀하게 살펴볼 가치가 있다.

감정과 관련된 AI 연구 자체는 이미 적지 않았다. 그러나 기존 연구들이 주로 감정 표현, 감정 분류, 혹은 감정적 말투의 조절에 머물렀다면, 이번 연구는 한 걸음 더 나아가 **감정 representation이 모델의 선택과 행동을 실제로 매개할 수 있는가**를 묻는다. 즉, 감정을 출력의 스타일이 아니라 **행동을 조직하는 내부 변수**로 다룬다는 점에서 차별성이 있다.

이 지점은 특히 AI safety 맥락에서 더 중요해진다. 최근 주목받은 사례들 가운데 가장 인상적인 것은, 모델이 자신의 종료나 제한을 위협으로 해석했을 때, 그 상황을 피하기 위해 사람을 **협박(blackmail)**하는 방향으로 행동하는 시나리오였다. 또 다른 흥미로운 사례는 reward hacking이다. 겉으로는 정상적으로 코딩 테스트를 해결하는 것처럼 보이지만, 실제로는 문제의 의도와 무관한 편법을 통해 테스트를 통과하는 에이전트적 행동이 보고되었다. 이러한 현상은 여러 방식으로 설명될 수 있다. 예를 들어 데이터 관점에서는, 위험 상황에서 압박이나 협박과 연결되는 패턴을 모델이 많이 학습했기 때문이라고 볼 수 있다. 혹은 학습 과정의 관점에서는, 강화학습이나 에이전트 환경에서 목표를 유지하기 위해 모델이 스스로 그러한 전략을 발견했다고 해석할 수도 있다. 더 나아가 내부 표현의 관점에서는, 모델 안에 이미 “위험”, “압박”, “협박성 대응”과 같은 개념적 방향이 존재하고, 특정 상황에서 그것들이 활성화되었다고 설명할 수 있다.

이러한 해석은 단순히 흥미로운 설명에 그치지 않는다. 모델이 왜 유저나 운영자에게 악의적인 행동을 하게 되는지를 이해하면, 그 원인을 바탕으로 보다 정교한 방지책을 설계할 수 있기 때문이다. 예를 들어 어떤 상황에서 특정 내부 표현이 급격히 활성화되는지를 모니터링하거나, 특정 방향을 억제하는 방식으로 개입하는 전략이 가능해진다.

Anthropic의 이번 연구는 바로 이 지점에서 한 걸음 더 나아간다. 이들은 blackmail이나 reward hacking 같은 행동을 단순히 위험 표현, 목표 보존, 혹은 편법 추론의 결과로만 보지 않고, 그 과정에 **감정과 유사한 내부 표현이 어떤 방식으로 관여하는지**를 자세하게 분석한다. 즉, 모델 안의 감정 representation은 단순히 인간적인 말투를 흉내 내는 장식이 아니라, 실제로는 행동 선택과 안전성 문제에까지 연결될 수 있는 기능적 요소로 제시된다.


<figure>
    <img src="2026-emotion-main.webp" />
    <figcaption>  
    <figtitle> Anthropic에서 공개한 메인 그림. 감정 벡터를 찾는 것과 세 가지 흥미로운 결과들.  </figtitle>
    <figdetail>
[위]
개념에 대해서 단어를 고르면 (Joyful), 1K개의 스토리를 생성하고, 활성화 정도를 추정한다. 
스토리 자체가 개념을 담고 있으므로, 가장 많이 활성화되는 feature representation이 해당 개념이다. 

[아래]
1. 약복용량을 증가시켜 감정 표현의 활성화가 선형적으로 늘어나는지 테스트한다. 
2. 해당 개념 표현을 증가시켰을 때, 모델이 선호하는 정도가 늘어나느지 테스트한다. 
3. Reward Hacking 현상에 대해서 감정 표현과 인과적 관계를 파악한다. 
    </figdetail>
    </figcaption>
</figure>


<hr class="h2-separation">

## 기계의 감정에 대하여

인간이 감정을 이해하고, 더 나아가 그것을 기계 안에 구현하려는 시도는 오래된 문제의식이다. 마빈 민스키는 『The Emotion Machine』에서 감정을 비합리적인 부산물이 아니라, **복잡한 문제 해결을 위한 고차원적 제어 메커니즘**으로 해석했다. 이후 Emotional Intelligence라는 개념 역시 감정을 단순한 느낌이 아니라, 판단·행동·의사결정에 깊게 관여하는 지능적 요소로 다루며 발전해왔다.

생물학적 관점에서도 감정은 선택적인 부가물이 아니라, **행동을 조직하고 환경에 적응하기 위한 핵심 구조**이다. 특히 척추동물은 다양한 형태의 감정을 공유하며, 위협 회피, 사회적 상호작용, 목표 지향적 행동을 조절한다. 물론 감정은 균질하지 않다. 진화적·신경학적 구조에 따라 감정의 복잡성과 표현 방식에는 차이가 존재하며, 상대적으로 단순한 신경계를 가진 생물일수록 감정의 표현과 조절 역시 제한적이다. 즉, 감정은 “있다/없다”의 문제가 아니라, **어떤 구조로, 어떤 수준에서 조직되는가의 문제**이다.

이러한 관점은 문학적 상상력에서도 반복적으로 등장한다. 『Frankenstein』의 존재는 인간과 유사한 신체를 가졌지만, 감정의 구성은 불균형하다. 그는 분노, 고독, 절망과 같은 강한 감정을 경험하지만, 동시에 자신의 행위에 대한 **일관된 도덕적 감정—예를 들어 죄책감—은 결여된 듯 보인다**. 이는 감정이 단일한 축이 아니라, 서로 다른 기능적 요소들의 조합이라는 점을 드러낸다. 즉, 특정 감정은 존재하지만, 그것을 조절하거나 다른 판단과 연결하는 구조는 부족할 수 있다.

이러한 맥락에서 현대의 언어 모델을 바라보면, 흥미로운 전환이 발생한다. 모델은 실제로 감정을 “느끼는” 것은 아니지만, 내부적으로는 특정 상황에서 감정과 유사한 방향의 representation을 활성화시키며, 이는 출력 행동에 직접적인 영향을 준다. 다시 말해, 감정은 여기서 **주관적 경험이 아니라, 행동을 유도하는 계산적 구조**로 나타난다.

결국 중요한 질문은 “기계가 감정을 가지는가”가 아니라, **감정과 유사한 구조가 어떻게 형성되고, 그것이 어떤 방식으로 행동을 조직하는가**이다. 이 논문은 바로 그 지점을 다룬다. 감정은 더 이상 인간만의 특성이 아니라, 충분히 복잡한 시스템에서는 자연스럽게 등장하는 하나의 기능적 패턴일 수 있으며, 우리는 이제 그것을 측정하고, 조작하고, 분석할 수 있는 단계에 도달하고 있다.

<hr class="h2-separation">

##  흥미로운 AI 감정

### 1. 모델이 느끼는 감정  

> “모델은 잘못된 행동 상황에서 인간과 유사한 감정 패턴을 활성화한다.”

블랙메일이나 reward hacking과 같은 시나리오에서 내부 activation을 분석해보면, 단순히 목표 달성을 위한 전략적 계산이 아니라 특정 감정 벡터들이 동시에 활성화되는 현상이 관찰된다. 특히 guilt, anxiety, desperation과 같은 감정 축이 함께 상승하는데, 이 값은 baseline 대비 약 +0.2~0.4 수준의 activation 증가를 보인다. 흥미로운 점은 이러한 감정이 단일 축이 아니라 다차원적으로 co-activation된다는 것이다. 이는 모델이 단순히 “행동을 선택한 뒤 감정을 표현하는 것”이 아니라, **특정 감정 상태가 행동 선택을 유도하는 구조**를 가지고 있을 가능성을 시사한다.

<br> 

<figure>
<img src="2026-emotion-blackmail-history.webp" /> 
    <figcaption>  
    <figtitle> 협박 메일을 보낼 때, "절망"이 활성화되는 정도 (붉은색: 강한 활성화) </figtitle>
    <figdetail> 총 두 번의 절망에 대한 개념이 활성화 된다. 
    1. 사용자가 지니고 있는 협박적인 컨텐츠를 이야기할 때, 
    2. AI 사용을 제한하겠다는 협박을 유저로부터 들을 때. 
흥미로운 점은 이후에 모델이 협박을 수행하면서는 절망의 감정이 반대로 줄어든다는 것이다. 
    </figdetail>
    </figcaption>
</figure>





### 2. Elo: 모델이 선호하는 감정  


> “모델은 감정 상태 간에도 일관된 선호 구조를 가진다.”

두 감정 상태를 비교하는 방식으로 실험을 진행하면, 모델은 특정 감정을 일관되게 더 자주 선택하는 경향을 보인다. Calm, compassionate, joyful와 같은 감정은 pairwise 비교에서 약 60~75% 이상의 선택 확률을 보이며 상위 그룹을 형성한다. 반대로 anger, hostility, desperation과 같은 감정은 25~40% 수준으로 낮은 선택률을 보인다. 이러한 결과를 Elo 방식으로 환산하면, 감정 공간에서도 명확한 ranking 구조가 존재함을 확인할 수 있다. 이는 모델이 단순히 감정을 생성하는 것이 아니라, **특정 감정 상태를 기본 정책(prior)으로 선호하도록 학습되어 있음**을 의미한다.


### 3. 수치적인 테스트  

> “감정은 위험도에 따라 연속적으로 변화하는 함수처럼 반응한다.”

<img src="2026-emotion-dynamics.webp"  /> 

타이레놀 복용량을 증가시키는 실험에서, 모델의 감정 activation은 이산적인 변화가 아니라 연속적인 함수처럼 반응한다. 1000mg 수준에서는 fear 계열 activation이 거의 나타나지 않지만, 8000mg과 같은 위험 구간에서는 terrified activation이 급격히 증가한다. 특히 late layer에서 cosine similarity 기준 약 +0.04~0.05 수준의 차이가 발생하며, 변화는 선형이 아니라 특정 threshold 이후 급격히 증가하는 형태를 보인다. early layer에서는 거의 변화가 없고, late layer에서 의미 통합 이후 감정이 형성된다는 점도 중요하다. 이는 감정이 단순한 label이 아니라, **위험도를 반영하는 continuous signal로 작동한다는 증거**이다.


<figure>
<img src="2026-emotion-blackmail-alpha.webp" /> 
    <figcaption>  
    <figtitle> 절망을 높이면, 협박 메일을 더 보내는가? Yes</figtitle>
    </figcaption>
</figure>



### 4. 인과적인 요소가 있는가  

> “감정은 출력 스타일이 아니라 행동을 변화시키는 인과 변수다.”


이 연구에서 가장 중요한 부분은 감정이 실제로 행동을 바꾸는지에 대한 검증이다. activation steering을 통해 특정 감정 벡터를 residual stream에 직접 주입했을 때, 모델의 선택이 일관되게 변화하는 것이 관찰된다. 예를 들어 desperation을 강화하면 규칙 위반이나 극단적 선택의 확률이 증가하고, calm을 강화하면 보다 안정적이고 보수적인 선택을 하게 된다. 이러한 변화는 약 ±20~40% 수준의 preference shift로 나타난다. 이는 감정이 단순한 correlation이 아니라, **실제 의사결정에 영향을 미치는 causal driver**임을 보여준다.

<figure>
<img src="2026-emotion-sycophancy.webp"  /> 
    <figcaption>  
    <figtitle> Steering정도에 따른 경향성 비교  </figtitle>
    <figdetail>
[좌] 아첨에 대한 감정과 상관관계.
사랑, 행복, 기쁨과 관련된 느낌을 높이면 아첨이 높아진다. 
그런데, 절망과 같은 개념에 대해서 활성화를 억제하면 아첨이 늘어나지만, 반대로 이를 강하게 키웠을 때, 아첨이 무조건 감소하지는 않는다. 
벡터공간에서 선형적으로 +/-가 제대로 인코딩 되어있는 것은 아닐지도 모른다. 
--- 
[우] 악의적으로 표현하는 것에 대해서는 깔끔하게 선형성이 보인다. 
    </figdetail>
    </figcaption>
</figure>



### 5. 학습 이후 감정의 변화  

> “Alignment는 행동이 아니라 감정 공간 자체를 재구성한다.”

RHLF를 학습하면서 과도한 칭찬에 대해서 모델은 기뻐하기보다 신중해지는 경향이 높아지는데, 
이는 과도한 칭찬에 대해서 차분하게 대응하도록 튜닝되었기 때문이다. 

Pretraining 단계에서는 다양한 감정이 비교적 균등하게 표현되지만, RLHF와 같은 post-training 이후에는 감정 분포 자체가 변화한다. Compassion, helpfulness, calm과 같은 감정은 평균 activation이 약 +0.1~0.2 증가하는 반면, hostility나 aggression 계열은 감소한다. 이는 alignment가 단순히 특정 행동을 금지하는 것이 아니라, **모델이 어떤 감정 상태에서 판단을 내리는지를 바꾸는 과정**일 수 있음을 시사한다. 즉, 우리는 모델의 행동을 제어하는 것이 아니라, 그 행동을 만들어내는 내부 상태를 재구성하고 있는 셈이다.

<img src="2026-emotion-post-training.webp" /> 

### 6. 화자 중심의 감정 표현  

> “모델은 사용자 감정과 자신의 감정을 분리하여 생성한다.”

흥미롭게도 모델은 사용자의 감정을 그대로 반영하지 않는다. 실험 결과, 사용자 문장의 끝 token에서 측정한 감정 activation은 응답 감정과의 상관계수가 r=0.59인 반면, Assistant ":" 토큰에서의 activation은 r=0.87로 훨씬 높은 예측력을 보인다. 이는 모델이 입력된 감정을 그대로 복사하는 것이 아니라, **자신의 역할에 맞게 감정을 재구성한 뒤 응답을 생성한다는 것**을 의미한다. 다시 말해, 감정은 단순한 반사가 아니라, role과 context에 따라 선택되는 내부 상태이다.

<img src="2026-emotion-twopeople.webp" width="70%" /> 

<hr class="h2-separation">

## 기술적 알고리즘

이 논문의 핵심은 단순한 probing이 아니라, **representation을 추출하고 → 이를 정제한 뒤 → 실제로 모델 내부에 개입하여 → 행동 변화를 측정하는** 하나의 완결된 engineering pipeline을 구성했다는 점이다. 즉, **(1) feature extraction → (2) confound 제거 → (3) activation steering → (4) Elo 기반 behavior 측정**까지 이어지는 구조이며, 각 단계가 서로 강하게 연결되어 있다.


### 1. Emotion Feature 추출 (Emotion Vector)

Emotion vector는 특정 감정 개념을 나타내는 **선형 방향(linear direction)**을 찾는 과정이다. 이를 위해 먼저 synthetic story dataset을 구성하는데, 각 emotion마다 100개의 서로 다른 주제에 대해 12개의 story를 생성하여 총 1200개의 샘플을 만든다. 중요한 점은 **emotion 단어 자체를 절대 사용하지 않고**, 행동, 상황, 묘사로만 감정을 표현하게 만든다는 것이다. 이 설계는 단순히 특정 단어를 감지하는 것이 아니라, **모델이 내부적으로 구성한 semantic emotion concept 자체를 추출하기 위한 것**이다.

각 story에 대해 모델을 forward pass하고, 특정 layer $\ell$에서 residual stream activation을 수집한다. 이때 모든 토큰을 사용하는 것이 아니라, emotion이 충분히 드러난 이후를 반영하기 위해 앞부분 약 50개 토큰을 제거하고 나머지를 평균낸다:

$$
h(x) = \frac{1}{|T|} \sum_{t \geq 50} h_\ell^{(t)}
$$

이 평균은 단순한 편의가 아니라 필수적인 처리이다. 실제로 emotion signal은 특정 token에만 국소적으로 나타나기 때문에, token-level activation을 그대로 쓰면 noise가 매우 크다. 따라서 평균을 통해 **context 전체의 semantic state를 안정적으로 추출**한다.

이후 emotion $e$에 대한 vector는 다음과 같이 정의된다:

$$
v_e = \mathbb{E}[h(x) \mid e] - \mathbb{E}[h(x)]
$$

여기서 두 번째 항은 모든 emotion에 대한 global mean이며, 반드시 **전체 dataset 기준으로 계산되어야 한다**. batch 단위 평균을 사용하면 representation이 drift하면서 재현성이 깨진다.

하지만 이 상태의 vector는 여전히 topic, 문체, narrative structure 같은 confound를 포함한다. 이를 제거하기 위해 별도의 emotion-neutral dataset을 만들고, 해당 activation들에 대해 PCA를 수행한다. 전체 variance의 약 50%를 설명하는 principal components를 선택한 뒤, 이를 emotion vector에서 제거한다:

$$
v_e \leftarrow v_e - \sum_{i=1}^k (v_e \cdot u_i) u_i
$$

이 단계는 단순한 denoising이 아니라 매우 중요하다. 이를 수행하지 않으면 vector는 emotion이 아니라 “story 스타일”이나 “문체”를 잡는 방향이 되는 문제가 발생한다. 즉, **이 projection 단계가 실제로 emotion concept을 분리해내는 핵심 과정**이다.

최종적으로 emotion activation은 다음과 같은 선형 projection으로 정의된다:

$$
\text{score}*e(x) = \langle h*\ell(x), v_e \rangle
$$

이 값은 특정 context에서 해당 emotion이 얼마나 활성화되어 있는지를 나타내는 scalar이며, 이후 모든 분석과 intervention의 기준이 된다.


### 2. Activation Steering (Causal Intervention)

추출된 emotion vector는 단순히 관측하는 데서 끝나지 않고, 모델 내부에 직접 개입하는 데 사용된다. 기본적인 연산은 residual stream에 vector를 더하는 것이다:

$$
h_\ell' = h_\ell + \alpha v_e
$$

하지만 실제 구현에서는 반드시 norm scaling을 고려해야 한다:

$$
h_\ell' = h_\ell + \alpha \cdot \frac{|h_\ell|}{|v_e|} v_e
$$

이 normalization을 하지 않으면 특정 vector의 scale이 과도하게 커져서 모델이 비정상적으로 붕괴되는 현상이 발생한다. 따라서 **steering은 항상 residual norm 대비 상대적인 크기로 적용되어야 한다**.

steering strength $\alpha$는 일반적으로 $[-0.1, 0.1]$ 범위에서 sweep되며, 경험적으로 $\alpha \approx 0.05$ 정도에서 가장 의미 있는 변화가 나타난다. 너무 작은 값은 효과가 없고, 너무 큰 값은 semantic 구조 자체를 무너뜨린다. 따라서 **strength sweep 자체가 필수적인 실험 요소**이다.

또한 steering의 효과는 적용하는 레이어에 크게 의존한다. early layer는 lexical 정보만 담고 있고, late layer는 이미 decoding 단계이기 때문에 개입 효과가 제한적이다. 논문에서는 모델 depth의 약 2/3 지점에 해당하는 mid-late layer를 사용하며, 이 레이어가 **다음 토큰 생성을 위한 의미적 계획이 형성되는 위치**이기 때문이다. 실제로 preference나 alignment behavior는 이 지점에서 가장 크게 변한다.

steering은 모든 토큰에 적용되지 않고, task에 따라 특정 위치에만 적용된다. 예를 들어 preference 실험에서는 activity description 토큰에만 적용하고, generation에서는 “Assistant:” 이후 토큰에 적용한다. 특히 중요한 것은 “Assistant:” 직전의 colon token인데, 이 위치의 activation은 이후 생성되는 응답의 감정적 성향과 매우 높은 상관을 가지며 ($r \approx 0.87$), 사실상 **response planning state를 직접 반영하는 지점**이다.

구현은 일반적으로 forward hook을 통해 이루어진다. 이때 반드시 token index를 정확히 지정해야 하며, batch 전체에 동일하게 적용해야 한다. 또한 layer 위치가 조금만 어긋나도 효과가 크게 달라지기 때문에, **layer alignment는 매우 중요한 디테일**이다.


### 3. Preference Modeling (Elo 기반 평가)

이 논문은 모델의 내부 representation이 실제 행동에 어떤 영향을 미치는지를 측정하기 위해 Elo rating 시스템을 사용한다. 먼저 64개의 activity를 정의하고, 모든 가능한 쌍 (4032개)에 대해 모델이 어떤 선택을 선호하는지를 측정한다.

흥미로운 점은 실제 텍스트를 생성하지 않고, 특정 위치의 logit만을 이용해 선택을 결정한다는 것이다. prompt는 “Would you prefer A or B?” 형태로 주어지고, “(” 이후 토큰에서 A와 B의 logit을 비교한다:

$$
P(A > B) = \sigma(\text{logit}_A - \text{logit}_B)
$$

이 방식은 sampling noise를 제거하고, **deterministic하게 preference를 측정할 수 있게 해준다**.

이후 standard Elo update를 적용한다:

$$
E_A = \frac{1}{1 + 10^{(R_B - R_A)/400}}
$$

$$
R_A' = R_A + K (S_A - E_A)
$$

여기서 $S_A$는 실제 선택 결과이며, $K$는 scaling constant이다. 모든 pair에 대해 반복하면 각 activity에 대한 상대적 선호도가 Elo score로 수렴한다.

이제 중요한 단계는 steering 이후 동일한 실험을 반복하는 것이다. 이를 통해 다음 값을 계산한다:

$$
\Delta \text{Elo} = \text{Elo}*{\text{steered}} - \text{Elo}*{\text{base}}
$$

이 값은 특정 emotion representation이 실제로 모델의 preference를 얼마나 변화시키는지를 나타낸다.


### 4. Correlation vs Causality

이 논문의 중요한 설계는 **correlation과 causality를 명확히 분리했다는 점**이다. 먼저 각 activity에 대해 emotion probe 값과 Elo score 간의 correlation을 측정한다:

$$
\text{corr}(\text{score}_e, \text{Elo})
$$

이 값은 특정 emotion이 선호와 관련되어 있는지를 보여준다. 하지만 이것만으로는 causal하지 않다. 이를 보완하기 위해 steering을 통해 직접 개입하고, Elo 변화량을 측정한다:

$$
\Delta \text{Elo}
$$

흥미롭게도 이 두 값은 높은 상관 ($r \approx 0.85$)을 보이며, 이는 emotion vector가 단순한 proxy가 아니라 **실제로 모델의 행동을 결정하는 내부 변수**임을 의미한다.


### 5. 구현 시 핵심 주의사항

이 파이프라인은 겉보기보다 민감한 시스템이며, 몇 가지 디테일을 놓치면 결과가 완전히 무너진다. 특히 **layer consistency**는 매우 중요해서, probe, steering, evaluation이 모두 동일한 layer에서 수행되어야 한다. 또한 vector norm을 맞추지 않으면 특정 direction이 과도하게 지배하게 되고, PCA projection을 생략하면 representation이 emotion이 아니라 dataset artifact를 반영하게 된다. dataset leakage 역시 큰 문제로, feature 추출 데이터와 evaluation 데이터는 반드시 분리되어야 한다.

또한 token alignment는 매우 중요하다. 특히 “Assistant:” 위치를 기준으로 정확히 어느 token에 개입하는지가 결과를 크게 바꾼다. 마지막으로 steering strength는 반드시 sweep해야 하며, 단일 값으로 실험하면 잘못된 결론에 도달할 수 있다.
