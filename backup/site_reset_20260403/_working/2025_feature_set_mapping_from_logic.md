---
layout: distill
title: 'Feature Set Mapping from Logic'
gradient: linear-gradient(135deg, #0064e1 0%, #5bd3ff 100%)
hover-gradient: linear-gradient(135deg, #00c6fb 0%, #005bea 100%)
date: 2025-05-14
background_color: rgb(255, 231, 214)
---


LLM의 내부에 대한 상태에 대해서 이를 논리적인 형태의 지식과 연결하는 것은 중요하다. 그러나 두 개의 대응관계에 대한 이해는 쉽지 않으며, LLM의 표현공간에 대한 이해와 Logic의 공간에 대한 성질을 바탕으로 맵핑을 정의하는 것이 필요하다. 이 연구에서는 두 공간에 대한 가정을 바탕으로 대응 관계를 정의하고, 만족하는 성질을 탐구한다. 


> ### Definition (Feature Set $\mathcal{F}$)
> Feature Set $$\mathcal{F} = \{f_1, f_2, \cdots, f_{N_{\text{feat}}} \}$$ includes all features activated in LLM where $N_{\text{\feat}}$ is the number of features assumed in LLM. The obtaining feature sets are based on dictionary learning such as SAE.  

이 정의는 기존 LLM 해석에서 사용한, 개념들에 대한 집합이 존재하며, 모델의 입력 $I$로 주어진 프롬프트에 대해서, 포함하는 개념이나, 이후 생성하려는 개념들을 포함하여 상기한다는 점을 나타낸다. 논리적인 공간에 대해서는 $\mathcal{F}$ 집합이 주어진 background knowledge (propositional atoms $\mathcal{W_0}$) 이나 논리적 규칙에 의해서 떠올리는 개념들을 포함할 가능성이 있다. 더욱이 추론 과정에서 결론 명제 $\phi$ 를 생각해낸다면, 이는 모델이 답을 생성하기 전에 개념적인 공간에 표현되어 있을 가능성이 있다. 

> ### Definition (Proposition $\phi = \phi_{P, \vec{a}}$ ) 
> The proposition $\phi = \phi_{P, \vec{a}}$ where $P \in \mathcal{P}$ is a predicate symbol in the set of predicates $\mathcal{P}$ and $\vec{a} = (a_1, \cdots, a_{\text{arity}(P)})$ is the ordered set of symbols $\mathcal{C}$ with $a_i \in \mathcal{C}$. Clearly, the size of $\vec{a}$ depends on the predicate $P$. 

이 정의는 명제들을 나타내기 필요한 형태를 정의하는데, LLM의 모델 내부에서 논리적인 명제들에 대한 feature가 존재한다는 가정이 있으며, 이 명제는 논리적인 공간에서 predicate와 초기화되는 constant들, 혹은 variables로 정의된다는 점이다. 모델 내부에서는 variable을 포함한 명제 $P(X, Y)$ 등과 같은 형태에 대해서도 인코딩하고 있을 가능성이 있는데, 이는 임의의 predicate $P$에 대한 특징이거나, X,Y를 constant를 포함한 어떤 심볼로 표현하는 것이다. 

> ### Definition (Feature Set Mapping $\mu: \mathcal{\Phi \rightarrow 2^{ | \mathcal{F} | }} $)
> A mapping $\mu: \mathcal{\Phi \rightarrow 2^{ | \mathcal{F} | }} $ maps a proposition $\phi$ to a set of features $F \subset  2^{ | \mathcal{F} | }$ where $$F = \{ f_1, \cdots, f_{N_{\phi}} \}$$ with number of features $N_{\phi}$. 

이 정의는 임의의 논리 명제가 LLM의 feature 공간에 대응된다는 점을 나타내며, 이 때, 임의의 명제 $\phi = \phi_{P, \vec{a}}$ 는 predicate $P$ 와 symbols $\vec{a}$를 feature들의 조합으로 표현된다. 단순히 feature로 대응되는 것이 아니라, feature set으로 대응되는 것은 두 가지 이유가 있는데, (1) 특정 명제의 개념을 효율적으로 표현하기 위해서 feature를 재사용한다는 점이며, 만일 이 가정이 없다면, 임의의 proposition들은 모두 다른 feature 들로 맵핑되거나, 혹은 중복되는 feature로 맵핑될 수 밖에 없다. (2) Predicate 에 symbol이 결합되는 과정은 feature의 수가 기하급수적으로 늘어난다. 다음 Proposition을 보라. 

<blockquote markdown ="1">
### Proposition: Number of Features for Proposition Encoding
Given a set of predicates $\mathcal{P}$,  a set of symbols $\mathcal{C}$ and maximum number of arity $A$, the number of propositions is bounded by $ | \mathcal{P} | \cdot | \mathcal{C} |^N$. Consider the number of values in the mapped representation. To encode individual proposition, we need $N_F$ number of features with 

$$
| {N_P} | \cdot | {N_C} |^{N_A} < {N_F}
$$  

Note that as we include one symbol, number of features should be increased linearly w.r.t $N_P$ and exponentially with $N_A$. To resolve the exponential increase of feature mapping, we considered a mapping has co-domain of set of features.  
</blockquote>

명제를 feature로 맵핑을 통해서 인코딩 한다는 것은 feature set들 간의 조합에 대해서 정의를 필요로 한다. 먼저, 논리적인 명제들이 지니고 있는 성질들을 바탕으로 feature mapping은 어떠한 조건을 만족해야 하는지 밝힐 필요가 있다.

1. If $\vec{a} \ne \vec{b}$, then  $\mu(\phi_{P, \vec{a}}) \ne \mu(\phi_{P, \vec{b}})$ for any $P$. 
2. If $P \ne Q$, then  $\mu(\phi_{P, \vec{a}}) \ne \mu(\phi_{Q, \vec{b}})$ for any $\vec{a}, \vec{b}$.
3. If $\Phi_1 \ne \Phi_2$, then $\mu{(\Phi_1)} \ne \mu{(\Phi_2)}$ where $\Phi$ is a set of propositional atoms. 

논리에서 명제를 평가하는 것은 그것이 참 또는 거짓으로 귀결될 수 있는지 확인하는 것이다. 반면에 LLM에 대해서 명제를 평가한다는 것은 LLM의 논리적인 추론이 유도될 수 있는지를 확인하는 것이다. 주어진 feature set에 대해서, 논리적인 평가를 올바르게 유도할 수 있다면, 그 feature 집합은 올바르게 구성되었다고 정의될 수 있으며, 반대로 feature 집합이 최소한으로 정의되어 있다는 말은, 집합 내의 특징에 대해서 원소를 제거하였을 때 LLM의 명제 $\phi$에 대한 평가가 잘못 내려지는 경우이다. 

> ### Definition: Valuation function $v$ of feature set 
The valuation function for feature set $$ v^{\text{feat}}_{\phi}: 2^{|\mathcal{F}|} \rightarrow [0,1]$$ is the evaluation function of the proposition $\phi$ with an LLM. When LLM correctly evaluate the truth value of $\phi$, $v^{\text{feat}}_{\phi} =1$. The valuation function could be determined in several ways.   

4. (Minimality Mapping) If $v_\phi(\mu(\Phi)) \ge v_\phi(\mu(\Phi) - f)$ for any $f$ when $\phi \in Cn(\Phi)$.

Based on the minimality assumption, we have the following criteria to evaluate the logical feature mapping of LLMs. 

$$
\Delta_f^{-} =  v_\phi(\mu(\Phi)) -  v_\phi(\mu(\Phi) - \{f\}) 
$$

When 
$\mu(\Phi)$ is well-constructed, that is, $\mu$ is a proper mapping means, that 
for 

$$
\Delta_f^{-} < 0 ~ \text{if } f \in \mu(\Phi),
$$

> ### Definition: Necessity of $\mu(\Phi)$
> If $\Delta_f^{-} < 0$ for all $f \in \mu(\Phi)$, then $\mu(\Phi)$ is necessary.



We can check the sensitivity of the mapped features by evaluating 
1. the average difference for in-features $\mu(\Phi)$. 
2. the average difference for out-features  $\mathcal{F} - \mu(\Phi)$. 


유사하게 robustness도 평가할 수 있는데, 이는 집합 내에 있지 않은 특징을 넣었을 때, $v$값이 영향을 받지 않는 것이다. 반면에 $v$값이 증가한다면, 이는 $\mu(\Phi)$가 minimal아 아니라는 것을 나타낸다. 

$$
\Delta_f^{+} =  v_\phi(\mu(\Phi) \cup \{f\} ) -  v_\phi(\mu(\Phi)) 
$$


> ### Definition: Minimality of $\mu(\Phi)$ 
> If $\Delta_f^{+} \le 0$ for all $f$. Then, $\mu(\Phi)$ is minimal. 


--- 

# The last hidden representation does not encode full theory. 

논리적인 정보를 인코딩 하는 과정에서 Theory $$\Phi = \{\phi_1, \phi_2, \cdots \}$$ 에는 많은 명제들이 들어있다. Hidden representation에는 많은 정보가 담겨져 있다고 알려져 있는데, 여기서는 모델의 마지막 hidden state가 주어진 Theory의  명제들을 모두 담지 못한다는 주장을 한다. 즉, Hidden state가 포함하고 있는 정보는 일부 정보들이라는 것이며, 이는 $\mu$ 가 partial 하게 정의된다는 점을 나타낸다. 

> ### Conjecture: Existence of impossible theory feature set mapping 
> For a given language $\mathcal{L}$, there exists a theory $\Phi$ such that $\mu(\Phi)$ is not defined. 

First reason is that LLMs compute based on a given query. As such, the hidden representation includes the processed information. 

Second reason is that the LLMs use causal masked modeling and time step could be used to represent the theory rather than collapsing the information in the last hidden state. 

Third reason is that the feature should be concise excluding unnecessary information. 

Fourth, it is impossible to distinguish theories with the feature space. The feature space is bounded by the number of features, either engineered way. 


In conclusion, we assume that the hidden representation only includes the subset of the original theory $T$ and possibly partial extension of the theory (rather than full extension such as a closure)


따라서, 모든 Theory의 정보가 담겨져 있기보다, 그 중에서 필요한 일부 정보가 특정 시간의 hidden에 담겨져 있는 것이다. 이는 query와 관련되어 있거나, local하게 관련된 이론들이 담겨져 있는 것으로 보이며, 결국 sub-theory $T_{\text{sub}}$ 는 LLM이 추론과정에서 형성하는 어떤 집합을 나타내는 것이다. Interpretation의 가정은 $\mu(T_{\text{sub}})$ 가 존재한다는 것을 나타낸다. 더욱이 sparse autoencoder는 매 순간마다 많은 개념이 아니라 일부 개념들이 결합되서 연산이 되는 것을 나타낸다. 따라서, theory의 표현에 대해서 해석에 대한 가정을 적용한다면, 전체 theory를 담는 것은 관찰할 수 없다. 

> 이에 대해서 probing 실험을 진행할 수 있는데, T를 인코딩 하고, $\phi$에 대한 참 거짓을 모델 내부 hidden으로부터 추정할 수 있는지 검사하는 것이다. 만일, $\phi$ 자체가 last hidden에 가깝거나, query와 관련되어 있을 때 detection이 잘된다면, 이는 모델의 hidden이 전체가 아니라 일부를 담고 있음을 나타낸다. 이걸 보이면, 모델의 전체 시퀀스에 대한 hidden이 Theory의 변화를 반영한다는 점을 보일 수 있다. 그러나 만일 이게 사실이라면, 모델의 hidden을 통해서 지식을 바꾸려고 시도한다면, query 위치에서 바꿔줘야 하는데, 왜냐하면 뒤에 정의된 논리적 결과물들은 모두 앞을 통해서 만들어졌기 때문이다. 즉, cache를 intervention하는 것은 위험하다. 혹은 이후에 바꾸기 위해서 transition에 대한 revision이 이루어지는 것인데, 이는 기존 belief state에 대한 revision을 취하는 공리를 고려하여, 지식에 대한 수정이 이루어져야 한다. 그런데 AGM 모델에서는 기존 $K$ 라는 집합을 고려하였는데, LLM에 대해서도 이 $K$라는 집합을 고려할 수 있는가? 여기까지 살펴본 바에 의하면 불가능한데, 왜냐하면 LLM은 마지막 지식 상태를 가지않기 때문이다. 한 가지 가능성은 LLM에 대해서 앞에서 추론한 결과물을 통해서 현재 Theory가 정확히 어떻게 이루어지는지 파악하는 과정일 들어가야 하는데, 이를 위해서는 Dynamics로부터 무엇을 참이라고 믿었는지 검수를 해야 하며, 단지 마지막 상태로부터 추론은 안된다. 즉 inference 과정에서 무엇을 참으로 생각하는지, 그리고 그것을 향후에 바꾸는지 dynamics하게 관리하는 메모리가 필요하다. 이걸 하기 위해서는 표면적으로 참이라고 생각한 것과 더해서 hidden으로부터 무엇을 참이라고 인식하고 있는지, 그리고 기존 믿음이 어떻게 바뀌었는지 이해할 필요가 있다. 


<img src="https://d2acbkrrljl37x.cloudfront.net/research/blog/proposition_space_with_search.png" width="100%" height="auto" class="styled-image"/>



> Query 위치에 대해서 LLM은 매 순간 진리값을 처리하며, 내부 표현은 주어진 명제들과 관련된 개념들이 활성화 되는 것이다 
> Theory를 빌드하는 과정에서는 토큰에 의해서 그 방향성이 좌우된다.  
> 심볼당 특징이 존재하는가? 
> Predicate당 특징이 존재하는가? 
> Proposition의 진리값에 대한 정보가 존재하는가? 

> Predicate들이 symbol을 중복해서 사용하는 경우 내부 해석은 어떻게 할 수 있는가? 
> A. (sparse 하게 K개의 proposition을 반영)
> B. (sparse 하게 proposition에 구성되는 요소들을 반영)




