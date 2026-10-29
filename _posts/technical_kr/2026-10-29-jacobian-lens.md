---
layout: post
title: "Jacobian Lens: 어떤 반응이 끝까지 남을까?"
permalink: /blog/2026/jacobian-lens-kr/
mini-title: "Jacobian Lens"
---

## 1. 같은 표현을 읽는 두 가지 방법

*그 새가 하늘을 난다.* 이 문장에서 *새가*라는 단어를 생각해 보자. 모델이 단어를 처리하면서 만든 hidden state에는 Eagle이나 Penguin 같은 새의 종류뿐 아니라, Fly와 같은 행동에 관한 정보도 표현되어 있을 수 있다. 그런데 이 hidden state를 어떻게 읽느냐에 따라 우리가 관찰하는 정보는 달라질 수 있다. 가장 익숙한 방법은 **Logit Lens**다. 현재 hidden state를 unembedding에 바로 전달해서 어떤 토큰이 강조되는지 살펴보는 방법이다. 반면 **Jacobian Lens(J-lens)**는 조금 다르게 접근한다. 현재 표현을 그대로 읽는 대신, 이 표현의 변화가 이후 층에 어떤 영향을 미치는지 고려한 뒤 그 결과를 읽는다.

그렇다면 같은 hidden state라도 어떤 Jacobian을 거치는지에 따라 다른 정보가 강조될 수 있을까? 아래 데모를 통해 살펴보자.

### 데모 1. Jacobian을 바꾸면 무엇이 달라질까?

{% include figures/jacobian-lens.html lang="kr" %}

먼저 아래쪽 입력 행에서 *새가*를 선택하고, 상단의 Logit Lens와 J-lens를 번갈아 눌러보자. 입력은 *새가*와 *하늘을* 중에서 고를 수 있다. Logit Lens에서는 현재 hidden state를 직접 읽으므로, 상위 층의 노드를 변경해도 읽는 표현 자체는 달라지지 않는다. 반면 J-lens에서는 선택한 출력 위치에 따라 Jacobian이 달라진다. 예를 들어 2층의 *새가*를 선택하면 Eagle과 Penguin이 강조되지만, 3층의 *새가*를 선택하면 Fly가 강조되도록 구성되어 있다. 같은 층에서 여러 노드를 선택하는 것도 가능하다. 이 경우 선택한 위치들의 Jacobian을 평균해서 사용한다.

여기서 중요한 것은 입력 hidden state가 같더라도 **어떤 출력 위치의 반응을 관찰하느냐에 따라 다르게 읽힐 수 있다**는 점이다. 물론 실제 모델이 2층에서는 새의 종류를, 3층에서는 행동을 표현한다는 뜻은 아니다. 이 데모는 Jacobian의 선택이 해석 결과에 어떤 차이를 만드는지 보여주기 위해 직접 구성한 예시다. 그렇다면 J-lens는 구체적으로 어떤 계산을 통해 이러한 차이를 만들어낼까?

## 2. Jacobian은 hidden state를 어떻게 바꿀까?

J-lens의 핵심 연산은 생각보다 간단하다.

$$
h\longrightarrow Jh
$$

현재 hidden state $h$에 Jacobian $J$를 곱하는 것이다. Logit Lens가 $h$를 직접 unembedding으로 읽는다면, J-lens는 Jacobian으로 변환한 $Jh$를 읽는다. 결국 두 방법의 차이를 이해하려면 먼저 Jacobian이 어떤 행렬인지 살펴볼 필요가 있다.

### Jacobian은 이후 표현의 반응을 나타낸다

입력 층 $l$의 위치 $i$와 출력 층 $L$의 위치 $j$를 생각해 보자. 이 둘 사이의 Jacobian은 다음과 같이 정의할 수 있다.

$$
J_{l,i\rightarrow L,j}(c)
=
\frac{\partial h_{L,j}(c)}
{\partial h_{l,i}(c)}
$$

여기서 $c$는 문맥을 나타낸다. 이 식은 입력 위치의 hidden state가 조금 달라졌을 때, 출력 위치의 hidden state가 얼마나, 그리고 어느 방향으로 달라지는지를 보여준다. 쉽게 말해 **현재 표현의 작은 변화가 이후 연산에 어떤 반응을 일으키는지** 나타내는 행렬이다. 그런데 Transformer에서는 하나의 입력 위치가 여러 출력 위치에 영향을 줄 수 있다. 따라서 특정 출력 위치만 관찰할 수도 있고, 여러 위치의 반응을 함께 살펴볼 수도 있다. 입력 위치와 출력 위치 사이의 거리를 $s=j-i$라고 하자. 이 거리를 *lag*라고 부른다. 출력 위치들의 lag를 모은 집합을 $S$라고 하면 평균 Jacobian을 다음과 같이 구성할 수 있다.

$$
G_S(c)=\frac{1}{|S|}\sum_{s\in S}J_s(c)
$$

여기서 한 단계 더 나아가 여러 문맥의 Jacobian까지 평균하면,

$$
\bar G=\mathbb E_c[G_S(c)]
$$

를 얻는다. 이제 J-lens는 이 평균 행렬을 hidden state에 적용하고, 정규화와 unembedding을 거쳐 토큰 분포를 계산한다.

$$
P_J=
\operatorname{softmax}
\left(
W_U\operatorname{Norm}(\bar Gh)
\right)
$$

여기서 $W_U$는 unembedding 행렬이다. 반대로 $\bar G=I$라면 hidden state가 변환 없이 전달되므로, 동일한 정규화와 unembedding을 사용한다는 조건에서 Logit Lens와 같아진다. 앞선 데모에서는 여러 문맥에 대한 평균 $\bar G$ 대신, 하나의 문맥에서 선택한 출력 위치들의 평균 $G_S(c)$를 사용했다. 한 가지 주의할 점도 있다. Jacobian은 작은 입력 변화에 대한 국소적인 반응을 나타낸다. 따라서 $\bar Gh$가 실제로 모델이 이후 층에서 계산한 hidden state와 같다는 뜻은 아니다. J-lens는 Jacobian을 활용해 새로운 해석용 표현을 구성하는 방법이다.

### 데모 2. 행렬이 표현을 바꾸는 과정

{% include figures/jacobian-matrix.html lang="kr" %}

이번에는 그래프와 독립적인 행렬 예시를 살펴보자. 위에서 선택한 입력이나 출력 노드를 바꿔도 이 데모의 값은 달라지지 않는다. 데모에는 고정된 4차원 입력 벡터 $h$와 임의의 4×4 행렬 $J$가 있다. 먼저 **Logit Lens** 버튼을 눌러보자. 이 경우에는 identity matrix를 사용하므로 입력 벡터가 그대로 전달된다. 이어서 **J-space** 버튼을 누르면 입력은 그대로인데, 행렬이 달라지면서 $Jh$의 각 성분이 변하는 것을 볼 수 있다. 오른쪽의 **Read by Unembedding**은 이 결과 벡터를 토큰별 logit으로 읽는 다음 단계를 나타낸다. 여기서 J-space는 버튼의 이름이며, sparse reconstruction까지 구현한 것은 아니다. 행렬과 벡터의 곱은 다음과 같이 쓸 수 있다.

$$
Jh=\sum_k h_kJ_{:,k}
$$

여기서 $J_{:,k}$는 행렬 $J$의 $k$번째 열벡터다. 즉, 입력 $h$의 각 성분이 Jacobian의 열벡터를 얼마나 사용할지 결정하고, 그 결과가 합쳐져 새로운 표현 $Jh$를 만든다. 이 관점에서 보면 Jacobian의 **column space**가 중요해진다.

$$
Jh\in\operatorname{Col}(J)
$$

입력이 무엇이든 변환된 표현은 $J$의 column space 안에 존재하기 때문이다. 데모의 L2 정규화는 크기만 바꾸므로, 정규화 후 unembedding에 전달되는 벡터도 같은 공간에 남는다. 실제 모델의 정규화에 좌표별 재조정이나 이동이 포함되면 그 뒤의 공간은 달라질 수 있다. 하지만 이것만으로는 충분하지 않다. 가령 데모의 행렬처럼 $J$가 full rank라면 column space는 전체 4차원 공간과 같다. 이때는 어떤 방향으로 변환할 수 있는지를 아는 것보다, **어떤 방향의 신호가 더 강하게 전달되는지** 알아보는 편이 유용하다. 이를 살펴보기 위해 SVD를 사용해 보자.

## 3. 왜 서로 다른 입력이 비슷하게 읽힐까?

Jacobian을 Singular Value Decomposition(SVD)으로 분해하면 다음과 같다.

$$
J=U\Sigma V^\top
$$

이를 입력 벡터 $h$에 적용하면,

$$
Jh=\sum_k\sigma_k u_k(v_k^\top h)
$$

가 된다. 식이 조금 복잡해 보이지만, 각 항의 역할은 명확하다. 먼저 $v_k^\top h$는 입력이 $v_k$ 방향과 얼마나 정렬되어 있는지를 나타낸다. 여기에 singular value $\sigma_k$가 곱해지면서 반응의 크기가 정해지고, 최종적으로 $u_k$ 방향으로 전달된다. 정리하면 다음과 같다.

- $v_k^\top h$: 입력이 해당 방향과 얼마나 정렬되어 있는가?
- $\sigma_k$: 그 반응을 얼마나 크게 전달하는가?
- $u_k$: 결과를 출력 공간의 어느 방향으로 보내는가?

따라서 Jacobian은 입력에 포함된 여러 방향의 신호를 각각 다른 크기로 전달하고, 이를 다시 조합하는 행렬로 이해할 수 있다. 여기서 한 가지 흥미로운 경우를 생각해 보자. 만약 첫 번째 singular value $\sigma_1$이 다른 값보다 압도적으로 크다면 어떻게 될까? 예를 들어 다음 조건이 성립한다고 하자.

$$
\sigma_1|v_1^\top h|
\gg
\sigma_2\|h\|_2
$$

이때는 첫 번째 항이 나머지 성분보다 훨씬 크므로,

$$
Jh\approx\sigma_1u_1(v_1^\top h)
$$

로 근사할 수 있다. 이 식에서 재미있는 점은 입력 $h$가 서로 달라도, 첫 번째 항이 지배적이라면 출력은 대부분 $u_1$ 방향을 따른다는 것이다. 특히 $v_1^\top h$의 부호가 같은 입력들은 L2 정규화 이후 비슷한 방향으로 정렬될 수 있다. 다시 말해, **서로 다른 hidden state가 Jacobian을 통과하면서 비슷한 출력 표현으로 모일 수 있다.** 이것이 J-lens의 입력 의존성이 상대적으로 약해질 수 있는 한 가지 이유다.

물론 항상 그런 것은 아니다. 입력이 $v_1$과 거의 직교한다면 다른 singular vector의 영향이 커질 수 있고, $v_1^\top h$의 부호가 반대라면 결과는 $-u_1$ 방향에 가까워질 수도 있다. 또한 $u_1$ 자체가 Eagle이나 Fly 같은 개념을 뜻하는 것은 아니다. 어떤 토큰이 강조되는지는 이 방향을 unembedding으로 읽었을 때 결정된다. 앞선 행렬 데모에 사용한 $J$의 singular value를 계산하면 다음과 같다.

$$
\Sigma\approx\operatorname{diag}(1.2150,\;0.9115,\;0.6818,\;0.6053)
$$

이 예시에서는 하나의 값이 압도적으로 크지는 않다. 위에서 설명한 방향 정렬은 singular value 사이의 차이가 더 큰 행렬에서 두드러질 수 있는 현상이다. 그렇다면 다음 질문은 자연스럽다. **왜 어떤 방향의 singular value는 크게 남고, 다른 방향은 작아질까?** 이를 이해하려면 평균 Jacobian이 만들어지는 과정을 다시 살펴봐야 한다.

## 4. 어떤 반응이 평균에서 살아남을까?

앞에서는 하나의 Jacobian이 입력을 어떻게 변환하는지 살펴보았다. 하지만 실제 J-lens에서는 여러 출력 위치와 문맥의 Jacobian을 평균할 수 있다. 이 과정에서는 반응의 크기뿐만 아니라 **반응 방향이 얼마나 일관되게 유지되는지**도 중요해진다. 간단한 상황을 생각해 보자. 어떤 입력 방향에 대해 두 출력 위치의 Jacobian이 모두 강하게 반응한다고 하자. 그런데 한쪽은 특정 방향으로, 다른 쪽은 정확히 반대 방향으로 반응한다면 어떻게 될까? 각 반응의 크기는 크지만, 두 벡터를 평균하면 서로 상쇄된다. 반대로 반응의 크기가 조금 작더라도 여러 출력 위치에서 비슷한 방향을 유지한다면 평균 이후에도 그 신호가 남을 수 있다.

문맥에 대해서도 마찬가지다. 특정 문장에서 강하게 나타나는 반응이라도 다른 문장에서는 반대 방향으로 나타난다면, 문맥 전체를 평균했을 때 약해질 수 있다. 따라서 평균 Jacobian에서 어떤 방향이 중요해지는지는 개별 반응의 크기만으로 설명할 수 없다. 논문 *A Mathematical Theory of the Jacobian Lens*는 이 관계를 세 가지 요소로 나누어 설명한다.

| 요소 | 살펴보는 질문 |
|---|---|
| **Magnitude** | 개별 Jacobian의 반응이 얼마나 큰가? |
| **Lag coherence** | 출력 위치가 달라져도 반응 방향이 유지되는가? |
| **Context coherence** | 문맥이 달라져도 반응 방향이 유지되는가? |

Magnitude는 평균 이전의 반응 크기를 나타낸다. Lag coherence는 여러 출력 위치의 반응을 평균했을 때 얼마나 많은 신호가 남는지 보여준다. 반응 방향이 일관되면 1에 가까워지고, 서로 상쇄되면 0에 가까워진다. Context coherence는 출력 위치에 대한 평균 반응이 문맥을 바꿔도 얼마나 일관되게 남는지 나타낸다. 두 coherence는 0과 1 사이의 값을 가지며, 분모가 0인 경우에는 0으로 정의한다. 수식으로 쓰면 세 요소는 다음과 같다. $G_S(c)$는 문맥 안에서의 lag 평균, $\bar G$는 그 결과의 문맥 평균이다.

$$
\begin{aligned}
M(v)&=\mathbb E_{c,s}\|J_s(c)v\|_2,\\
C_{\mathrm{lag}}(v)&=\frac{\mathbb E_c\|G_S(c)v\|_2}{M(v)},\\
C_{\mathrm{context}}(v)&=\frac{\|\bar Gv\|_2}{\mathbb E_c\|G_S(c)v\|_2}.
\end{aligned}
$$

이 세 요소를 곱하면 평균 Jacobian이 특정 입력 방향 $v$를 얼마나 강하게 전달하는지 나타낼 수 있다.

$$
\|\bar Gv\|_2
=
\operatorname{Magnitude}(v)
\cdot
\operatorname{LagCoherence}(v)
\cdot
\operatorname{ContextCoherence}(v)
$$

이때 비교하는 입력 방향 $v$의 길이는 1로 고정한다. 그런데 여기서 SVD와 연결되는 중요한 사실이 하나 있다. 행렬의 첫 번째 singular value는 단위 입력 방향 중에서 출력의 크기를 가장 크게 만드는 값이다.

$$
\sigma_1(\bar G)
=
\max_{\|v\|_2=1}\|\bar Gv\|_2
$$

따라서 앞의 관계를 대입하면,

$$
\sigma_1(\bar G)
=
\max_{\|v\|_2=1}
\left[
M(v)\,C_{\mathrm{lag}}(v)\,C_{\mathrm{context}}(v)
\right]
$$

로 표현할 수 있다. 여기서 $M$은 magnitude, $C_{\mathrm{lag}}$와 $C_{\mathrm{context}}$는 각각 lag coherence와 context coherence다. 이 식은 세 요소가 각각 최대인 방향을 찾는다는 뜻이 아니다. **세 요소의 곱이 가장 커지는 방향**을 찾는다는 뜻이다. 이 곱을 최대화하는 방향을 평균 Jacobian의 첫 번째 오른쪽 singular vector $v_1$로 선택할 수 있다.

### 강한 반응과 일관된 반응은 다르다

이제 앞선 SVD의 의미를 조금 다르게 볼 수 있다. 특정 방향의 singular value가 크다는 것은 단순히 모델이 그 방향에 강하게 반응한다는 것만을 의미하지 않는다. 평균 Jacobian에서는 그 반응이 출력 위치와 문맥에 걸쳐 얼마나 일관되게 유지되었는지도 함께 반영된다. 물론 반응이 강하면서 일관되기까지 하다면 평균 이후에도 크게 남을 가능성이 높다. 반대로 개별 반응이 강하더라도 방향이 계속 바뀐다면 평균 과정에서 상당 부분 상쇄될 수 있다. 여기서 첫 번째 데모를 다시 생각해 보자. 우리는 출력 위치를 선택해서 Jacobian을 바꾸었다. 그리고 같은 입력 hidden state에 대해서도 서로 다른 토큰 분포를 관찰했다.

이는 어떤 Jacobian을 선택하고 평균하느냐에 따라, 특정 입력 방향이 얼마나 강하게 전달되는지가 달라질 수 있기 때문이다. 논문의 관점에서 보면 출력 위치와 문맥을 선택하는 일은 어떤 반응이 평균에서 살아남을지 결정하는 과정이기도 하다. 위 그래프는 한 문맥만 다루므로 context coherence의 변화까지 보여주지는 않는다. 독립적인 행렬 예시 역시 원래의 Jacobian 집합이 없으므로, 그 행렬만으로 세 요소를 따로 구할 수는 없다.

## 5. 어떤 Jacobian을 고르는가

첫 번째 데모에서 같은 *새가*를 두고 출력 노드만 바꿨을 때, 읽히는 분포는 달라졌다. 실제 분석에서도 입력·출력 층, lag 범위, 문맥의 선택은 어떤 반응이 강하고 일관되게 남을지를 바꾼다. 따라서 J-lens의 결과를 볼 때는 높은 확률의 토큰과 함께 **어떤 Jacobian을 선택하고 평균했는지**도 읽어야 한다. 그 선택이 magnitude와 두 coherence를 바꾸고, 평균 행렬의 singular value와 강조되는 출력 방향을 바꾸기 때문이다. **Jacobian을 고르는 방식이 lens의 해석 편향을 만든다.** J-lens가 보여주는 것은 그 선택 아래에서 강하고 일관되게 남은 반응이다.

## References

1. Ostrow, M., Qian, D., Liu, T. J. B., & Fiete, I. (2026). **[A Mathematical Theory of the Jacobian Lens](https://arxiv.org/abs/2610.31955)**. arXiv:2610.31955.
2. Anthropic. (2026). **[A global workspace in language models](https://www.anthropic.com/research/global-workspace)**. Jacobian Lens와 J-space를 소개한 원문.

<link rel="stylesheet" href="{{ '/assets/css/jacobian-lens-demo.css' | relative_url }}">
<script defer src="{{ '/assets/js/posts/jacobian-lens-demo.js' | relative_url }}"></script>
