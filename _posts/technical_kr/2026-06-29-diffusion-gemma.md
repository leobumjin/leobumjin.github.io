---
layout: post
title: DiffusionGemma는 무엇이 다른가
permalink: /blog/2026/diffusion-gemma-kr/
mini-title: DiffusionGemma
---

DiffusionGemma를 처음 보면 가장 헷갈리는 지점은 이름에 있다. diffusion이라고 부르지만 이미지 생성 모델처럼 연속적인 pixel noise를 제거하는 것은 아니고, 그렇다고 일반적인 LLM처럼 왼쪽에서 오른쪽으로 token을 하나씩 확정하는 것도 아니다. 핵심은 **고정된 길이의 token canvas를 만들고, 그 canvas 전체를 여러 번 denoising하면서 답변을 점점 정리한다**는 데 있다.

일반적인 autoregressive language model은 다음 token을 하나씩 생성한다. 이미 생성된 token은 고정되고, 뒤의 token은 그 이전 token들을 조건으로 결정된다. 반면 DiffusionGemma는 먼저 일정 길이의 canvas를 만들고, 이 canvas를 noisy token 상태에서 시작해 여러 denoising step을 거치며 수정한다. 따라서 한 번의 forward pass에서 하나의 token만 다루는 것이 아니라, canvas 전체 위치에 대한 logits를 동시에 계산한다.

이 구조 때문에 DiffusionGemma는 단순히 “빠른 Gemma”라고 보기 어렵다. 같은 Transformer 계열 backbone을 사용하더라도, inference-time computation graph가 다르다. Prompt는 한 번 prefill되어 KV cache로 저장되고, generation canvas는 그 KV cache를 참조하면서 반복적으로 바뀐다. 즉, 모델의 생성 과정은 “다음 token을 이어 쓰기”라기보다 **초안을 여러 차례 고쳐 쓰는 과정**에 가깝다.

최근 공개된 DiffusionGemma 분석 논문 역시 이 점을 중요하게 다룬다 [[Asaria et al., 2026](https://arxiv.org/abs/2606.14620)]. 이 논문은 DiffusionGemma가 정말로 완전히 병렬적인지, 혹은 사실상 autoregressive하게 동작하는지를 commit 순서와 confidence를 통해 추적한다. 흥미로운 결론은, 이 모델이 둘 중 하나로 깔끔하게 떨어지지 않는다는 것이다. DiffusionGemma는 큰 batch 단위로 여러 token을 동시에 확정하지만, 동시에 일부 상황에서는 약한 left-to-right bias도 보인다.

따라서 이 글에서 보고 싶은 질문은 단순하다. **DiffusionGemma는 무엇을 병렬화하고, 무엇은 여전히 순차적으로 처리하는가?** 그리고 self-conditioning, EB sampling, canvas라는 세 요소는 실제 생성 과정에서 각각 어떤 역할을 하는가?


<figure>
    <img src="2026-diffusion-gemma-structure" />
    <figcaption>  
    <figtitle> DiffusionGemma의 기본 구조. Prompt는 한 번 처리되고, canvas는 여러 step에 걸쳐 denoising된다.  </figtitle>
    <figdetail>
사용자의 prompt는 먼저 prefill 단계에서 처리되고, 이때 만들어진 KV cache는 denoising loop 동안 재사용된다.
따라서 매 step마다 prompt 전체를 다시 계산하지 않는다.

[계산]
1. 고정 길이의 token canvas를 noisy state에서 시작한다.
2. 각 denoising step에서 canvas 전체의 logits와 self-conditioning vector를 함께 갱신한다.
3. EB sampling은 확신이 높은 위치만 token으로 유지하고, 불확실한 위치는 다시 noise로 돌린다.
    </figdetail>
    </figcaption>
</figure>


<hr class="h2-separation">

## 전체 구조

DiffusionGemma의 구조를 가장 간단히 말하면 **prompt prefill + bidirectional canvas denoising**이다.

Prompt는 먼저 prefill 단계에서 처리된다. 이때 prompt context에 대한 KV cache가 만들어지고, 이 cache는 denoising loop 동안 계속 재사용된다. 즉, 매 step마다 prompt 전체를 다시 계산하는 것은 아니다.

반면 canvas는 매 denoising step마다 다시 계산된다. Canvas token이 계속 바뀌고, self-conditioning vector 역시 step마다 갱신되기 때문이다. 따라서 canvas 쪽의 hidden state, QKV, attention output, logits는 denoising step마다 새로 만들어져야 한다.

정리하면 다음과 같다.

**Prompt side**

* 사용자의 입력 prompt를 한 번 처리한다.
* Prompt에 대한 KV cache를 만든다.
* 이 KV cache는 denoising step 동안 재사용된다.

**Canvas side**

* 고정된 길이의 token canvas를 둔다.
* 처음에는 noisy token 상태에서 시작한다.
* 매 step마다 canvas 전체를 Transformer에 통과시킨다.
* Canvas 내부에서는 bidirectional attention이 가능하다.
* 따라서 뒤쪽 token 후보가 앞쪽 token의 수정에도 영향을 줄 수 있다.

이 점이 autoregressive model과 가장 크게 다르다. Autoregressive model은 이미 생성된 token을 나중에 바꿀 수 없지만, DiffusionGemma는 canvas 전체를 반복적으로 수정하므로 앞쪽 token도 이후 step에서 바뀔 수 있다.

다만 이 구조가 곧 “모든 token이 완전히 동시에 결정된다”는 뜻은 아니다. 실제 commit 과정에서는 여러 token이 큰 묶음으로 확정되기도 하고, task에 따라 위치별 확정 순서가 달라지기도 한다. 그래서 DiffusionGemma를 이해할 때는 **계산은 canvas 단위로 병렬화되지만, token commitment는 step을 따라 점진적으로 일어난다**고 보는 편이 더 정확하다.

<hr class="h2-separation">

## Denoising Step

한 denoising step에서 모델은 이전 canvas token과 self-conditioning vector를 함께 입력으로 받는다.

여기서 canvas token은 discrete state이고, self-conditioning vector는 continuous state다. 대략적으로는 이전 step의 canvas token embedding에 self-conditioning vector를 변환한 값을 더해서 Transformer에 넣는다고 이해할 수 있다.

한 step의 흐름은 다음과 같다.

* 이전 step의 canvas token $o^{t-1}$가 있다.
* 이전 step의 self-conditioning vector $S^{t-1}$가 있다.
* 둘을 이용해 canvas 전체에 대해 Transformer forward를 수행한다.
* 각 canvas position마다 vocabulary logits $l_i^t$가 나온다.
* 이 logits에서 다음 step으로 넘길 self-conditioning vector $S^t$와 candidate token $\hat{o}^t$가 만들어진다.

중요한 점은 **self-conditioning vector와 canvas token은 같은 logits에서 나오지만, 둘이 같은 것은 아니다**라는 점이다.

Self-conditioning vector는 logits distribution을 embedding space로 보낸 soft representation이다. 대략 다음과 같은 형태로 볼 수 있다.

$$
S^t = \text{softmax}(l^t / \tau) W_E
$$

즉, $S^t$는 top-1 token 하나가 아니라 여러 token 후보의 확률분포를 embedding space에서 섞은 값이다. 따라서 이것은 “모델이 이 위치에 대해 가지고 있는 soft belief”에 가깝다.

반면 canvas token $o^t$는 sampled candidate token에 EB sampling을 적용한 결과다. 따라서 $o^t$를 $S^t$의 top-1 token이라고 보면 안 된다.

이 차이는 작아 보이지만, DiffusionGemma를 이해할 때 매우 중요하다. 모델은 단순히 token 하나를 고르는 것이 아니라, **연속적인 belief state와 이산적인 noisy canvas state를 함께 유지**한다.

<hr class="h2-separation">

## Self-Conditioning

처음에는 자연스럽게 이런 질문이 생긴다.

> $S^t$가 logits에서 만들어진다면, $S^t$에서 가장 가까운 token을 뽑은 것이 곧 $o^t$인가?

답은 아니다. 한 step에서 logits는 두 갈래로 쓰인다.

* 하나는 self-conditioning vector를 만드는 데 쓰인다.
* 다른 하나는 candidate token을 sampling하는 데 쓰인다.

Candidate token은 categorical sampling으로 뽑힌다. 따라서 반드시 argmax나 top-1일 필요가 없다. 이후 EB sampling이 이 sampled token을 유지할지, 아니면 해당 위치를 다시 noisy token으로 돌릴지를 결정한다.

따라서 다음처럼 이해하는 것이 좋다.

* $S^t$는 모델의 **soft belief state**다.
* $o^t$는 그 step에서 실제 canvas에 들어가는 **discrete noisy token state**다.
* $S^t$의 top token은 interpretability를 위해 볼 수 있는 후보지만, 실제 canvas token과 항상 같지는 않다.

이 구분을 잡고 나면 DiffusionGemma의 구조가 훨씬 선명해진다. Self-conditioning은 다음 token을 직접 고르는 장치가 아니라, denoising trajectory가 이전 step의 판단을 잃지 않도록 해주는 **연속적인 기억 상태**에 가깝다.

<hr class="h2-separation">

## EB Sampling

DiffusionGemma는 각 denoising step에서 모든 canvas position에 대해 candidate token을 샘플링한다. 그런데 이 candidate token을 전부 그대로 쓰지는 않는다. 확신이 높은 위치는 유지하고, 확신이 낮은 위치는 다시 random token으로 바꾼다. 이것이 EB sampling, 즉 **Entropy-Bounded sampling**이다.

직관은 간단하다. 모델이 어떤 위치에 대해 확신하고 있다면 그 token을 유지한다. 반대로 entropy가 높아 아직 불확실하다면, 어설픈 token을 고정하지 않고 다시 noise 상태로 돌린다.

절차는 대략 다음과 같다.

* 각 canvas position마다 token distribution의 entropy를 계산한다.
* Entropy가 낮은 위치부터 정렬한다.
* 일정한 entropy bound 안에 들어오는 low-entropy position들을 keep한다.
* Keep된 위치는 sampled candidate token을 유지한다.
* 나머지 위치는 random token으로 renoise한다.

여기서 중요한 점은 **random token으로 바꾸는 것은 canvas token뿐**이라는 것이다. Self-conditioning vector $S^t$는 logits에서 계산된 soft belief로 다음 step에 넘어간다.

따라서 random renoising이 정보를 완전히 날리는 것은 아니다. 제거되는 것은 불확실한 discrete token commitment다. 다음 step에서 모델은 prompt KV cache, 주변 canvas context, 그리고 self-conditioning vector를 함께 보고 다시 판단한다.

이 구조는 다음처럼 볼 수 있다.

* $S^t$: 계산의 연속적 방향성을 보존하는 soft state
* $o^t$: 현재 step의 noisy discrete instantiation
* EB sampling: 확실한 위치만 commit하고, 불확실한 위치는 다시 열어두는 장치

즉, EB sampling은 단순한 sampling trick이 아니라 DiffusionGemma가 “확신한 것만 고정하고, 애매한 것은 나중으로 미루는” 핵심 메커니즘이다.

<hr class="h2-separation">

## Canvas와 KV Cache

Canvas에도 QKV가 있는가? 있다. Canvas도 Transformer에 들어가는 token sequence이므로, 각 layer에서 Q, K, V가 계산된다.

다만 autoregressive decoding과는 차이가 있다. 일반적인 autoregressive model은 새 token을 생성할 때 이전 token들의 KV cache를 재사용할 수 있다. 이전 token들은 이미 고정되어 있고, 이후 token이 이전 token에 영향을 줄 수 없기 때문이다.

DiffusionGemma의 canvas는 다르다. Canvas 내부 attention은 bidirectional이다. 어떤 위치의 token이 바뀌면 그 위치만 바뀌는 것이 아니라, 다른 위치들이 그 token을 attend하는 방식도 함께 바뀔 수 있다. 따라서 canvas QKV는 매 denoising step마다 다시 계산되어야 한다.

정리하면 이렇다.

* Prompt KV cache는 재사용된다.
* Canvas QKV는 매 step 다시 계산된다.
* Canvas 내부에서는 bidirectional attention이 가능하다.
* 이 때문에 모델은 뒤쪽 reasoning을 보고 앞쪽 answer를 수정할 수 있다.

이 점이 DiffusionGemma의 non-autoregressive behavior를 만든다. 단순히 여러 token을 동시에 출력하기 때문이 아니라, canvas 안에서 서로 다른 위치들이 반복적으로 영향을 주고받기 때문이다.

<hr class="h2-separation">

## Multi-Canvas Sampling

DiffusionGemma가 고정 길이 canvas를 사용한다면, 그보다 긴 답변은 어떻게 생성할까?

이 경우에는 multi-canvas sampling을 사용한다. 먼저 첫 번째 canvas를 denoising해서 완성한다. 그 다음 완성된 canvas를 prompt/context에 append하고, 다시 KV cache에 반영한다. 이후 새로운 canvas를 시작한다.

즉, 한 canvas 안에서는 diffusion 방식의 bidirectional denoising을 하지만, canvas와 canvas 사이에서는 block-autoregressive하게 진행된다.

따라서 DiffusionGemma를 완전히 non-autoregressive model이라고 부르기는 어렵다. 더 정확히는 다음과 같다.

> DiffusionGemma는 canvas 내부에서는 diffusion-based bidirectional generation을 하고, canvas 사이에서는 block-autoregressive generation을 하는 모델이다.

다만 최근 commit-order 분석은 여기서 한 가지를 더 보탠다. 실제 token 확정 순서는 “완전 병렬”도 아니고 “고정된 block-autoregressive 순서”도 아니다. 많은 token이 동시에 commit되지만, task와 측정 granularity에 따라 부분적인 순서성이 다르게 관찰된다. 결국 DiffusionGemma의 생성 과정은 architecture만 보고 단정하기보다, **denoising trajectory와 commit event를 함께 봐야 한다**.

<hr class="h2-separation">

## 장점과 한계

DiffusionGemma의 가장 큰 장점은 raw benchmark score라기보다 **낮은 batch size에서 빠른 generation 속도**와 **bidirectional canvas generation이 주는 구조적 유연성**이다.

일반적인 autoregressive model은 token을 하나씩 생성한다. 이 방식은 많은 사용자 요청을 batching할 때는 효율적일 수 있지만, 한 명의 사용자가 local GPU에서 interactive하게 사용할 때는 memory bandwidth bottleneck이 커질 수 있다. 매 token마다 model weights를 반복적으로 읽어야 하고, GPU의 병렬 계산 능력을 충분히 활용하지 못할 수 있기 때문이다.

DiffusionGemma는 이 문제를 다르게 푼다. 한 번에 canvas 전체를 처리하므로 GPU에 더 큰 병렬 계산을 준다. 목적은 memory-bound decoding을 compute-bound에 가깝게 바꾸는 데 있다.

장점은 다음처럼 정리할 수 있다.

* **빠른 single-user inference**  
  한 token씩 생성하는 대신 canvas 단위로 여러 token을 동시에 denoising한다.

* **Bidirectional attention**  
  Canvas 안의 모든 위치가 서로를 볼 수 있으므로 code infilling, inline editing, structured output, 수학적 구조, amino acid sequence 같은 non-linear domain에 유리할 수 있다.

* **Self-correction**  
  앞에서 나온 token을 나중에 수정할 수 있다. Autoregressive model처럼 한 번 출력한 token에 영구적으로 묶이지 않는다.

* **Adaptive stopping**  
  간단한 task에서는 denoising step을 적게 쓰고 빨리 멈출 수 있고, 복잡한 task에서는 더 많은 step을 사용할 수 있다.

하지만 성능에 대해서는 조심해야 한다. DiffusionGemma를 일반적으로 “더 강한 모델”이라고 말하기는 어렵다. 이 모델의 가치는 benchmark accuracy 하나로 판단하기보다, **latency-first, interaction-first model**이라는 관점에서 보는 편이 맞다. 최고 품질의 단일 답변이 중요할 때와 빠른 local inference가 중요할 때의 선택지는 다를 수 있다.

<hr class="h2-separation">

## 해석 가능성

DiffusionGemma가 흥미로운 이유는 단순히 빠르기 때문만은 아니다. 이 모델은 기존 autoregressive LLM과 다른 방식으로 중간 계산 상태를 만든다.

Autoregressive model에서는 chain-of-thought처럼 자연어 token sequence가 중간 reasoning을 어느 정도 드러낸다. 물론 그것이 항상 faithful한 것은 아니지만, 적어도 reasoning이 token sequence 형태로 외부화되는 경우가 많다.

반면 DiffusionGemma는 denoising step 사이에 두 가지 중간 상태를 넘긴다.

* Canvas token $o^t$
* Self-conditioning vector $S^t$

Canvas token은 읽을 수 있지만, self-conditioning vector는 dense vector이므로 바로 읽기 어렵다. 그래서 다음 질문이 생긴다.

> DiffusionGemma는 중간 reasoning을 사람이 읽을 수 없는 latent space에 숨기고 있는가?

이 질문은 interpretability 관점에서 중요하다. 만약 self-conditioning vector가 완전히 opaque한 hidden code라면, 우리는 최종 output과 중간 canvas token만으로는 모델의 계산을 충분히 이해할 수 없다. 반대로 self-conditioning vector가 token embedding 방향에 어느 정도 정렬된 soft token mixture라면, top-k token 후보나 distribution의 변화만으로도 denoising trajectory를 상당 부분 해석할 수 있다.

DiffusionGemma에서 관찰되는 diffusion-specific behavior도 이 문제와 연결된다.

첫째, **early length prediction**이 가능하다. 모델은 답변 내용을 완전히 정하기 전에 padding token probability를 통해 전체 응답 길이를 먼저 예측할 수 있다. 이는 모델이 “무엇을 말할지”보다 먼저 “얼마나 길게 말할지”를 잡는다는 뜻이다.

둘째, **retroactive self-correction**이 가능하다. 처음에는 답을 잘못 예측했다가, 뒤쪽 reasoning이 안정된 후 앞쪽 answer token을 수정할 수 있다. Autoregressive model에서는 이미 출력한 answer token을 되돌릴 수 없지만, DiffusionGemma에서는 canvas 전체가 수정 가능하기 때문에 이런 일이 가능하다.

셋째, **token smearing**이 나타난다. 모델이 어떤 token을 써야 하는지는 알지만 정확히 어느 위치에 둘지 아직 모르는 경우, 그 token의 probability가 여러 인접 위치에 퍼진다. 이후 denoising이 진행되면 특정 위치로 수렴한다.

넷째, **sequence smearing**도 가능하다. 단일 token이 아니라 여러 후보 sequence가 동시에 유지되다가 하나로 수렴하는 현상이다. 이는 DiffusionGemma가 token 단위의 후보만이 아니라, sequence-level alternative도 잠시 들고 있을 수 있음을 보여준다.

다섯째, **intermediate-context reasoning**이 가능하다. 어떤 token이 최종 출력에는 나타나지 않지만, 중간 계산을 위해 사용될 수 있다. 예를 들어 특정 숫자를 나중에 다른 문자열로 치환해야 하는 task에서, 모델이 먼저 숫자를 내부적으로 생성해 다음 항을 계산한 뒤 최종 출력에서는 그 숫자를 치환할 수 있다.

이런 현상들은 DiffusionGemma의 중간 상태를 해석하려면 최종 output만 보는 것으로는 부족하다는 점을 보여준다. 중요한 것은 output이 아니라 **denoising trajectory 전체**이다.

<hr class="h2-separation">

## 정리

DiffusionGemma는 기존 LLM의 token-by-token generation을 완전히 버린 모델이라기보다, generation을 **block-level iterative refinement**로 바꾼 모델에 가깝다.

모델은 매 step마다 두 상태를 함께 유지한다. 하나는 현재 canvas에 놓인 discrete token state이고, 다른 하나는 logits에서 만들어진 continuous self-conditioning state다. 이 두 상태가 함께 움직이면서, 모델은 확신이 높은 위치는 고정하고 확신이 낮은 위치는 다시 열어둔다.

그래서 DiffusionGemma의 generation은 단순한 decoding이라기보다, **계산 상태를 여러 번 갱신하면서 output structure를 점점 수렴시키는 과정**으로 볼 수 있다.

결국 핵심은 세 가지로 요약할 수 있다.

* **Canvas**: 여러 token 위치를 동시에 다루는 생성 공간
* **Self-conditioning**: logits에서 만들어진 soft belief state
* **EB sampling**: 확신 높은 token은 유지하고 불확실한 token은 다시 noise로 돌리는 선택 메커니즘

이 점에서 DiffusionGemma는 단순히 더 빠른 모델이 아니라, LLM generation을 “순차적 작성”에서 “반복적 정제”로 바꿔보는 실험이다. 그리고 이 실험은 앞으로 latent reasoning, monitorability, interpretability를 어떻게 봐야 하는지에 대해서도 새로운 질문을 던진다.
