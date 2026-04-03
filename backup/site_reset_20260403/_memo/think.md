---
layout: distill
authors: 
    - name: Bumjin Park
      affiliations:
        name: KAIST
bibliography: all.bib
giscus_comments: false
disqus_comments: false
date: 2024-12-29
featured: true
img: assets/img/bp.png
title: '[Thinking] What is role of Language in thinking?'
category: 'AI'
description: 'What is role of Language in thinking?'
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
    .styled-image:hover {
        transform: scale(1.2);
    }
---


## 생각 (thinking) 은 무엇인가? 

생각이라는 것은 포괄적인 의미를 담고 있는 것 같다. 목적을 달성하기 위해서 할 수도 있고, 목적 없이 자유연상을 할 수도 있다. 


언어는 다른 이들과 생각을 공유하여 의사소통을 가능하게 하며, 생각을 전달하고 생각을 받는 역할을 한다. 
인간의 언어라는 것은 생각의 내부 표현에 대해서 심볼 시스템으로 내보내는 것이다. 

언어는 의사소통이고 아래와 같은 연결고리를 가지고 있다. 
* 생각의 관점에서는 Thought -> Language -> Thought 
* 통신의 관점에서는 Language -> Thought -> Language 

즉, 언어라는 요소는 배출이고 통신이며, 여기에는 대화를 하는 대상들이 존재한다는 가정이 있다. 즉, 의사소통을 위한 분리이다.

따라서 언어라는 것은 생각을 위해 필요조건이 아니다. 
> infants are born equipped with a powerful toolkit for modeling and thinking about
> the world, including an understanding of physical objects and events, and the goals and actions of agents
> (Spelke, 2022; Spelke & Kinzler, 2007)

물론, 언어를 통해서 생각들은 전달되고 더 폭넓은 사고를 지닐 수 있다. 

*Language of thought* (Fodor, 1975), a structured symbolic
substrate for representing conceptual knowledge that provides a general interface to algorithms for problem
solving and reasoning.

These symbolic systems are not merely logic engines; they support our probabilistic
inferences, and rich intuitive simulations (Goodman, Tenenbaum, & Gerstenberg, 2014; Oaksford & Chater,
2007; Russell & Norvig, 2021).

논리적으로만 동작하는 것은 아니며, 확률적이고 시뮬레이션적인 요소들을 포함하여 동작한다. 

**문장의 의미(semantic)**를 **구조화(parse)**

Within linguistics and natural language processing, in turn, this paradigm underlies *semantic parsing systems* designed to map from human language into symbolic computational representations.

Semantic parsing은 문장의 의미적 구조를 컴퓨터가 이해할 수 있는 형태로 변환한다. 

```sql
// What is the weather in New York?
SELECT weather FROM database WHERE location = "New York"
```

probabilistic language of thought

probabilistic programs


We take a broadly rational perspective on language—we consider language to be a system of goal-directed actions for
externalizing and communicating thoughts to other intelligent beings (Chater & Manning, 2006; Gibson,
2014; Goodman & Frank, 2016)

In this context, we frame the problem of deriving meaning as inferring the
mappings between a language’s system of external communicative signals into the representations of rational
thought.


It is worth highlighting that thought does not require language and is distinct from language in the human brain (Mahowald et al., 2023). Non-human species, and pre-verbal infants (Spelke, 2022), are clearly capable of modeling the world towards their inferences and goals without language. But for humans, language clearly plays a profound role in determining the problems we think about, and how we think about them.


humans are resource-rational thinkers—under finite constraints of time and memory, we rationally allocate computational resources in order to make useful inferences and plans (S. J. Gershman, Horvitz, & Tenenbaum, 2015; Lieder & Griffiths, 2019).
Resource rational agents amortize computational effort across prior experience and problems, storing and reusing prior computation towards similar new problems that we encounter in the future (S. Gershman & Goodman, 2014; Le, Baydin, & Wood, 2017). 

Certain domains of inferences share more structure than others, and evidence suggests that we therefore heavily amortize them. Prior work, for instance, suggests that computations involved in basic perceptual activities (Brooke-Wilson, 2023; Dasgupta & Gershman, 2021; Fodor, 1983), such as object recognition under common lighting conditions, are highly amortizable from reusable patterns in computation that are learnable and shared across a background distribution of perceptual instances. This view suggests why fast, bottom-up pattern recognition models have made great advances in modeling perception in recent years, while it has proved much more challenging to amortize the wide range of flexible inferences required for arbitrary problem solving.

But while we take the view that a resource-rational agent should intelligently learn and reuse prior computation when possible, we do not view language-informed thinking, or thinking in general, as solely a matter of learning and interpolating over statistical patterns from prior experience. When we think, including when we think about the meanings we recover from language—to update our beliefs, to follow instructions, or to answer questions posed in language—we must be able to flexibly model arbitrary situations and support capacities for general problem solving, including inference, planning, and simulation, under a wide range of new and unencountered circumstances.

The efficient learnability of human language also highlights that, in many senses, the computational relationship between language and thought in humans is almost the inverse of that in today’s LLMs. For humans, language could be characterized as an emergent property of thinking. Infants can model the world and draw inferences well before they know language (Gopnik, 1996; Spelke, 2022), and reliably acquire complete linguistic capabilities from exposure to relatively tiny amounts of language (R. Brown, 1973). Congenitally-Deaf humans born with no language input spontaneously develop languages to communicate their thoughts, with the same basic hallmarks of mature natural languages (Goldin-Meadow, 2012; Pyers, Shusterman, Senghas, Spelke, & Emmorey, 2010; Senghas, Kita, & Ozyurek, 2004). This paper seeks to understand and model the cognitive and computational structures underlying this human scaling route to intelligence and language use

probabilistic language of thought (PLoT)

we then propose that large language models trained on language and code can be used to implement meaning functions in a resource-rational architecture – they can implement learned, broad-coverage mappings between language and code; and they can be understood as part of a human-like, resource-rational system that efficiently infers these mappings using stored patterns amortized from the prior joint distribution over language and code.

a generic inference query motif (Goodman, Mansinghka, Roy, Bonawitz, & Tenenbaum, 2008)

* Symbolic 하다는 것은 Symbol의 의미를 찾아야 한다. 이 때 프르토타입 등 활용 
* 연산 이후로 나타난 심볼이 반드시 의미가 명확하지 않을 있다..
* Amortization은 비용을 절감한다. 
* Translation과 Inference는 구분된다. 
* Symbolic 하다는 것은 Translation적인 요소가 없고 inference만 진행한다. 
* Subsymbolic 
* 통계적인 연산과 룰 기반, operation기반으로 연산
* In-context learning등은 수많은 Amortization으로부터 연산을 진행한다. feature를 형성하는 것은 amortization으로 고려될 있다. 
* Symbolic은 추론 과정에서 해석적인 과정을 추가하지 않는다. 그러나, LLM의 경우는 inference 과정에서 기존 추론의 결과가 
* Rule-based inference vs data-driven inference
* Working memory는 amortization하는 것들을 좀 더 강조하는 효과가 있다. 
* PLoT의 경우, 확률적인 연산을 추가하는 효과가 있다. 그러나, world model을 만드는 것은 쉽지 않을 것 같으며, LLM으로 만든 world model은 데이터를 기반으로 형성한 것일 가능성이 있다. 이후에 만들어진 world model로부터 연산을 진행하는 것이다. 물론 symbolic 또한 amortization을 활용할 수 있을 것이다. 
* Neurosymbolic에서 symbolization을 하는 것은 어떤 위험을 가지고 있는가? context 를 기반으로 심볼을 형성하는 것이다. 따라서 심볼 자체의 의미를 정확하게 파악하기 어려울 수 있다. 
* 모델에 심볼을 사용하는 것은 candidate set등을 지속적으로 평가할 필요가 있다. 즉, 의미라는 것을 나타내야 한다. 
* translation, inference, rational meaning construction, 
* resource-rational decision making  
* Language understanding and generation 
* Language translation and inference 
* Contextual amortization / In-context amortization 

이해란 무엇인가?
주어진 쿼리에 대한 어떤 알고리즘 A를 동작하려고 할 떄, 
이 알고리즘을 동작하도록 만드는 준비상태이다.
이해를 했다는 것은 정보가 준비상태로 있다는 것을 나타낸다. 
어떤 알고리즘을 선택하는지도 고려하였음

---

## 4 가지 용어에 대해서 

아키텍처의 한계, 심볼릭, 서브심볼릭, 통계적 추론, 연역적 추론, 알고리즘, 생각, 번역, 언어, 벡터 표현 등 다양한 요소들이 있다. 의미를 적확하게 이해하는 것은 LLM의 한계를 이해하고 필요한 모듈을 설계하기 위해서 필요한 과정이다. 이를 위해서 각 요소들이 나타내는 바를 명확히 하고 그들이 어떤 역할을 지니며, 한계점이 무엇이고, 그 한계점은 다른 어떤 모듈에 의해서 해소되어야 하는지 이야기 한다. 이 과정은 모델이 지닌 복잡적인 인지과정 혹은 알고리즘에 대한 전반적인 과정에 대한 해석이다.


### 이해라는 것은 무엇인가? (Understanding)

무언가를 이해한다는 것은 대상에 대한 처리 과정을 나타내며, 그 과정의 정확성은 질문으로부터 파악된다. 주어진 정보 $I$에 대해서 이 정보를 처리하여 $I$ 내부에 있는 정보를 정리하거나, 외부의 정보들을 준비하여 sufficient set $S$ 를 만든다. 이후 주어진 질문 $Q$에 대해서 $S$와 알고리즘 $F$를 통해서 정답 $A$를 생성한다. 따라서 대상에 대해서 이해한다는 것은 주어진 $I$에 대해서 정보 집합 $S$를 만드는 것이다. 

주어진 집합 $S$는 질문 $Q$에 의존적일수도 있고, 독립적으로 존재할 수도 있다. 더욱이 주어진 정보를 이해하는 것과, 정보와 질문을 동시에 이해하는 것은 차이가 있다. 혹은 정보는 없고 질문만 존재할 수도 있다. 이 모든 경우를 고려해서, 이해하는 과정은 sufficient set $S$를 만드는 것, 알고리즘 $F$를 만드는 것이다. 이후에 알고리즘 $F$에 의해서 정답 $A$를 얻는 과정은 이해의 영역이 아니다. 이해는 정보처리에 대한 선택의 과정이지, 도출하는 과정이 아니기 때문이다. 실행하는다는 것은, decision making 과정이며, 이 과정은 정보들을 알고리즘으로 어떻게 처리할지 결정하는 과정이다. 즉, $F$ 자체는 이해의 영역에서 어떤 것으로 구현하는지와는 상관없다. 
이는 Marr’s Three Levels of Analysis를 모두 포함하는 과정으로, Computational Level, Algorithmic Level, Implementation Level로 알고리즘을 생각한다. 
계획적인 단계이며, 실행 결과는 이해가 정확한지 평가하는 것이다. 

이해라는 것은 폭넓은 관점이다. 
정보에 대한 이해, 질문에 대한 이해, 정보와 질문에 대한 이해 등은 주어진 상태를 처리하는 과정을 나타낸다. 
흥미로운 사실은 이해의 과정에서 알고리즘 $F$는 정적이다. 물론, 동적인 알고리즘을 고려하여, 이해라는 과정이 알고리즘을 만들 수 있는지도 생각해볼 수 있다. 

이들은 기존 알고리즘들을 바탕으로 주어진 정보를 해체하여 분석하는 과정이다. 
분석은 어떤 Primitive 정보들이 있는지, 어떤 정보들과 결합될 수 있는지, 어떤 알고리즘을 적용해야 하는지 등을 포함한다. 
추론은 이들을 바탕으로 새로운 정보를 도출하는 과정이고, 
의사결정 (decision making)은 추론의 결과를 바탕으로 어떤 결과를 선택할지 결정하는 과정이다. 

* 정보처리: $(I, Q) \rightarrow S$ : 정보를 처리하는 과정 
* 추론: $(I, Q) \rightarrow (S, F) \rightarrow A$ : 정보를 처리하는 과정 
* 의사결정: $(I, Q) \rightarrow (S, F) \rightarrow D$ : 정보를 처리하는 과정 

$(S, F)$ 는 Sufficient set $S$를 찾는 것과 알고리즘 $F$를 선택하는 것이 특정 순서가 있거나 순서에 상관없이 존재함을 나타낸다. 
주어지는 정보 $(I, Q)$ 에는 정보라는 것이 쿼리가 포함될 수 있음을 나타낸다. 

#### LLM이 이해 정보를 이해했는가?

이해라는 관점에서 LLM이 특정 정보 혹은 (정보와 질문)을 이해했는지 분석해야 한다. 
LLM은 subsymbolic 표현으로 주어진 정보들을 처리하며, Query 토큰에 대해서 다음 토큰을 생성하는 모델이다. 
연산과정에서 정보처리 $S$와 알고리즘 $F$는 동시에 진행된다. LLM이 무엇을 이해했다고 말한다면, 이는 정보처리 $S$와 알고리즘 $F$를 통해서 출력 $A$ 혹은 의사결정 $D$ 를 도출할 수 있다는 점을 의미한다. 
    
Subsymbolic한 방식에 대해서 문제가 되는 것은 sufficient set $S$를 만드는지, 어떤 알고리즘 $F$를 사용하는지 명확하지 않다는데 있다. 
이는 통계기반 모델의 특징인데, Set에 필요한 정보들은 미리 계산된 amortized 형태로 존재하며, 그들에 대한 추가적인 변형과 조합을 통해서 연산을 하는 것이다. 
문제는 주어진 context에 대해서 sufficient set 자체를 매번 다르게 만든다는 점이고, 원소들은 symbolic 하기보다 vector형태의 표현들이다. 이로부터 유연적인 연산이 가능하지만, 
만일 알고리즘 $F$가 명시적이라면, 비명시적인 원소들로부터 하는 연산은 명확하지 않다. 한 가지 대안법은 function $F$와 symbolized 된 원소들을 활용해서 연산 자체를 해석가능하게 만드는 것이다. 
이러한 모델은 알고리즘 $F$와 원소들을 명확하게 하는 효과가 있으며, subsymbolic에 대한 명확한 symbolization 연산으로 봐야 한다. 
그러나 이 연산을 transformer architecture를 이용해서 구현하는 것은 다음과 같은 이유로 비효율적이다. 

1. Representation Superposition: 서로 겹치는 표현들에 대해서 모델이 명확하게 구분하지 못하며, 기존 다른 알고리즘 F, 정보처리 S를 바꿀 가능성이 있다. 
2. Flexibility of Implementation: Softmax 연산 등으로 어떤 것이 구현 가능한지 명확하지 않다. Family Relation 과 같은 문제에 대해서 이를 transformer 내부에 구현하는 것이 가능하지 않을 수 있다. 
3. Depth of Algorithm: 레이어를 지나면채서 표현을 바꾸는 방식이다. 알고리즘을 구현할 수 있을지라도, 알고리즘 자체가 많은 변형을 요구한다면, 현실적으로 불가능할 가능성이 있다. 이전과 마찬가지로 amortization을 통해서 연산을 효율화 시킬 수 있겠지만, distributed representation에 대해서 top-down 방식으로 amortization을 시키는 것은 어렵다. 

Bottom-up은 모델이 스스로 amortization을 만든다. 여기에 외부 힘에 의해서 amortization을 추가하는 연구는 진행되었지만, 일반화 성능 등 여전히 어려운 문제로 남는다. 또한 Feature engineering과 같은 요소들은 amortization된 표현을 선택하는 방식을 바꾸는 것이다. 궁극적으로 LLM은 amortization을 통해서 세계에 필요한 정보를 선택하여 $S$를 만들고 알고리즘 $F$를 모델 내부 연산으로 구현한다. 두 가지 연산 모두 transformer의 장점으로 볼 수 있으나, 이 연산들이 모든 종류의 $(I, S, F, Q)$에 대해서 동작하지 않는다는 한계가 있다. 따라서 LLM은 모든 종류의 지식을 이해할 수 없는 본질적인 한계가 있다. 

#### Symbolic Cognitive Architecture는 정보를 이해했는가? 

이해라는 관점에서 LLM이 bottom-up 기반, amortization 기반으로 정보를 이해하는 것과 유사하게, CA 또한 amortization 기반으로 연산을 처리할 수 있다. 
특히 적합한 규칙을 고르는 과정이나 샘플링 하는 과정에서 선택하는 정보들은 정보집합 $S$ 를 포함하는 closure $\bar{S}$ 에서 고르는 것으로 간주될 수 있다.
그들은 명확하게 전체집합이 정의되어 있으며, 작동하는 알고리즘 또한, primitive 규칙에 의해서 construction된다. subsymbolic한 표현과는 다르게 
primitive 의 조합으로 만들어진 복잡한 알고리즘 $F$는 심볼들에 대한 결정이기에 해석이 용이하다. 

특히 ACT-R의 구조는 $Q \rightarrow S \rightarrow F \rightarrow A$ 구조로 문제를 이해하고 답을 제공한다. 이 과정에서 $S$와 $F$는 subsymbolic과 다르게 명확하게 규정되어 있으므로 투명성한 연산 구조이다. 그러나, 이 자명성은 $S$의 집합과 $F$의 집합이 확장 가능성을 막는 요소로 작용한다. 따라서 CA는 다음과 같은 제한이 있다. 

1. 다룰 수 있는 정보와 알고리즘이 규칙 기반으로 작성될 수 있는 경우로 제한된다.
2. 복잡하지만 symbol로 작성될 수 있는 다양한 모델링을 포함할 수 있다. (finite, infinite combination에 대해서도 가능하다.)

규칙을 작성하는 과정에서 심볼이 지니는 의미가 퇴색되지 않아야 한다는 가정이 있다. Subsymbolic의 표현이 연산이 진행될수록 context 정보들으로 의미가 바뀔 수 있다는 점과 다르게 symbolic은 의미 변동이 없다는 가정을 한다. 이 가정은 고정된 컴포넌트들의 관계를 단단하게 모델링하는데 필요하며, 연산의 안정성을 보존한다. 즉, 정보를 이해하는 과정에서 symbol들을 통한 안정적인 알고리즘을 구현할 수 있는 장점이 있는데, 인간이 생각하는 language의 경우도 특정 단어들은 context를 기반으로 바뀔 수 있는 유동적인 표현을 지니는 반면, inference 당시 일부 단어들은 그 의미가 context에 의해서 바뀌지 말아야 한다. 물론 symbolic은 이에 적합하며, subsymbolic은 이에 부적합하다. 

### 의미란 무엇인가? (Meaning)

심볼은 의미를 알고 있는 것이라고 이야기 하며, subsymbolic은 표현의 의미를 명확하게 알기 어려운 것이다. 그렇다면 여기서 말하는 의미란 무엇인가? 
심볼릭한 연산들의 가정은 주어진 심볼이 나타내는 의미를 제3자가 명확하게 알 수 있다는 것이다. 대부분의 경우, 의미 (meaning)은 대상을 지정할 수 있어야 하는 특징이 있다. 
She라는 심볼이나, Alice라는 심볼을 사용하는 경우, 이 심볼이 지칭하는 대상을 정할 수 있다. 물론, 논리학에서는 심볼이 나타내는 바와 logical inference 자체는 독립적이라는 가정이 있다. 
그러나 해석적인 측면에서 심볼들은 world model을 통해서 참, 거짓, 모호함 등을 판단할 수 있기에, 지칭하는 대상이나 상태에 대해서 명확하게 판단할 수 있다. 

신경망에서도 neuron을 해석하는 과정에서 뉴런의 활성화를 분석하는 방식으로 지칭하는 대상을 명확하게 한다. CNN의 Network dissection, LLM Residual space에 대한 dictionary learning등은 그 특징 벡터의 활성화와 입력의 상관관계, 혹은 causal 관계 등을 토대로 특징을 해석하는 방식이다. 따라서, 심볼 혹은 subsymbolic에 대해서 의미를 찾는 것은 지칭하는 대상을 찾을 example 들을 찾거나, typical 한 것은 선정하거나, 더 나아가서는 특징들의 관계를 ontology로 표현하는 방식으로 의미를 규정할 수 있다. 

각 해석의 장단점은 
1. Example의 경우는 활성화의 정도가 다르기 때문에 set을 규정하는 것이 heuristic할 수 있으나 의미에 대한 포괄적인 이해를 가능하게 만든다. 
2. Typical의 경우는 대상을 단순화 할 수 있으며 여러 특징을 비교하는데 수월하다. 그러나, 대표 샘플을 설정하는 것이 쉽지 않다. 
3. Ontology의 경우에는 amortization을 하는 NN에 대해서 그 방식과 규칙은 동일한 아키텍처에 대해서는 universal할 수 있다는 가정을 고려할 수 있으나, 서로 다른 아키텍처, 데이터 유형, 학습 방법 등에 따라서 bottom-up으로 ontology가 구성되는 것을 해석하는 것이 어렵다. 반대로 top-down 방식으로 ontology를 구축할 수 있으나, complex한 real 데이터에 대해서 이를 규정하는 것은 어렵다 (CA가 실패한 이유와 비슷하게 scalable하지 못하다.). 

Symoblic의 장점은 알고리즘 $F$를 작동하는 과정에서 심볼들이 지칭하는 의미가 명확하다는 점에 있으며, 기존 관념에서는 주어진 의미 집합에서 작동한다는 특징이 있다. 
새로운 심볼을 유도하는 것에 대해서는 아직까지 논의된 바가 없다. 그러나, Neuro-symbolic 분야에서 알고리즘 $F$가 심볼을 생성하는 특징이 있다면, 그것의 의미를 위에서 언급한 3가지 방식, 혹은 그 이상으로 고려해서 심볼을 만들어낼 필요가 있다. 

### 언어라는 것은 무엇인가? (Language)

촘스키는 언어를 "유한한 규칙으로 무한한 문장을 생성할 수 있는 체계"로 정의했다. 이 정의에 따르면, 무한한 문장이 생성되어야 하고, 유한한 규칙이 존재해야 한다. 
언어의 목적은 소통이다 (레퍼런스 찾기). 이는 스스로에게 말을 하는 경우도 포함한다 내적 대화 (Intrapersonal Communication).  두 대상이 정보를 교류하고, 이를 통해서 서로의 유틸리티에 변화를 주는 과정으로 볼 수 있다. 일반성을 잃지 않고, $O_1$이 $O_2$에게 정보 $I$를 전달하는 과정에서는 공통의 언어가 사용될 수 있다. 물론, 이를 단순 입력으로 보는 경우, 체계성과 무한성이 존재하지 않기에 언어로 해석되지 않을 수 있다. 언어 $L$은 이를 위한 기초적인 역할을 하며, 커뮤니케이션을 하는 과정에서 주어진 정보 $I$ 는 소통을 위한 $L(I)$ 로 변환된다. 이는 $Q_2$에게 전달되며, 그는 이를 통해서 원래의 정보의 의미를 이해하며 $\hat{I}$ 를 도출한다. Communication protocol 역할을 하는 언어 $L$은 $I$의 의미를 언어적인 형태로 변형하며, 이 과정에서 $L(I)$은 합리적인 경우, 두 대상이 유사한, 동일한 것을 의미한다고 볼 수 있다. 따라서 언어라는 것은 의미에 대한 변환을 목적으로 하며, 이후 질의인 쿼리를 처리하기 위한 정보 전달을 담당한다. 

Subsymbolic 할지라도 여기에 규칙이 있을 수 있지만, 규칙에 의해서 생성된 심볼이 지니는 의미는 해석이 보장되지 않는다. 반면 심볼릭은 언어에 의해서 확장된 상태에 대해서 비록 복잡할지라도 그 의미를 해석할 수 있는데, 이는 체계성이 있으며, 심볼의 의미가 확장 이후로도 명확하기 때문이다. 

### 번역이라는 것은 무엇인가? (Translation)

이해, 의미, 언어 등 많은 요소들은 알고리즘에 의해서 쿼리에 대한 정답을 도출하기 위한 목표가 있다. 
이 때, 알고리즘이 사용되는데, 특정 정답을 도출하기 위해서는 가장 적합한 알고리즘을 선택해야 한다. 대표적으로 효율성, 정확성, 신뢰성 등은 알고리즘을 선택하는데 중요한 요소이다. 
예를 들어서, $2^10 =$ 을 계산할 때, 사용하는 알고리즘 (작동 방식과 구현)을 (1) LLM을 이용해서 subsymbolic하게 처리할 수도 있고, (2) symbolic하게 $2$를 차례대로 곱해가면 연산할 수도 있다. 정확성을 목표로 한다면, 심볼을 사용하는 (2)번의 방식이 적합하다. 한편, 알고리즘에 넣기 위해서는 입력 형태를 맞춰야 하며, 이는 규칙에 의한 언어적 변환일 수도 있고, 단순 함수로 정의될 수도 있다. Transformer에 넣는다면, [2, ^, 10, =] 을 토큰으로 순서대로 넣을 것이고, symbolic 알고리즘이라면, 다음과 같은 입력을 생각할 수 있다: $(시작=1, 곲=2, 반복=10)$. 두 가지 번역 모두 의미 상에는 차이가 없기 때문에, 출력값에 대해서 동일한 결과를 예상할 수 있다. 따라서 번역을 하는 것은 서로 다른 알고리즘들에 정보를 처리하기 위해서 형태를 변환하는 것으로 고려될 수 있다. 

### 생성이라는 것은 무엇인가? (Generation)

생성이라는 과정은 주어진 질문에 대해서 입력을 생성해내는 과정이다. LLM의 경우에는 데이터 분포를 기반으로한 알고리즘으로 주어진 in-context 정보를 활용하여, 다음 단어를 예측하는 생성을 진행하며, 생성된 단어는 다음 쿼리 역할을 한다. 알고리즘 $F$는 입력의 개수가 증가하는 경우에도 정상적으로 작동하기에 계산이 되는 한에서 무한히 생성할 수 있다. 

### 추론이라는 것은 무엇인가? (Inference)

Formal logic에 의하면, 추론이라는 과정은 기존 참인 명제들을 가지고 규칙 (inference rule)에 의해 새로운 명제를 도출하는 과정이다. 
유사하게, 이해의 관점에서 주어진 정보에 대해서 정보처리 $S$와 알고리즘 $F$를 통해서 정답 $A$를 도출하는 과정을 추론으로 해석할 수 있다.
위에서 언급한 것과 같이, 추론은 알고리즘을 필요로 하며, 입력 형태, 출력 형태 등을 고려하여 진행된다. 
추론에서 중요한 것은 효율성과 정확성이기에 알고리즘 선택은 추론하는 과정은 단순히 알고리즘 $F$로 연산하는 것을 넘어서, 알고리즘을 선택하는 과정을 포함해야 한다. 

### 의사결정이란 무엇인가? (Decision Making)

Inference는 정보를 바탕으로 새로운 결론을 도출하는 분석적 과정이고, Decision Making은 도출된 결론을 바탕으로 실행 가능한 선택을 내리는 과정이다. 

### 생각 이라는 것은 무엇인가? (Thinking)

Cognitive Science에서 Thinking은 목표를 해결하기 위해 정신적 모델(mental model)을 사용하여 추론하고 결정을 내리는 과정으로 정의된다. 

<blockquote>
Thinking, in many traditional cognitive theories, revolves around goal-directed world
modeling, inference, and decision making—constructing mental models of the world that reflect prior beliefs,
can be updated from new observations, and support rational prediction and decision making toward’s one’s
goals (Craik, 1967; Gentner & Stevens, 2014; Johnson-Laird, 1980, 1989; Lake, Ullman, Tenenbaum, &
Gershman, 2017; Morgan, 1999; Nersessian et al., 2010).
</blockquote>

### Research Target 

Cognitive Science에서 적으로는 인간의 뇌가 세계에 대한 모델링을 한다는 가정을 포함한다. 따라서 단순히 알고리즘적인 연산을 넘어서 belief를 포함한다.
LLM이 Thinking을 한다고 말하기 위해서는 세계에 대한 모델링을 직간접적으로 포함해야 하는 것이다. LLM의 내부에 구현된 알고리즘들이 단지 입-출력의 관점에서 작동하는 것을 넘어서
세계에 대한 확률적인 것을 포함해야 한다. 이 특별한 F들을 구현하기 위해서는 subsymbolic 적인 표현으로는 부족하며, 이러한 이유로 From words to worlds models에서는 언어에 대한 conversion을 토대로 세계를 생성하고, 추론을 진행한다. 인간의 뇌가 확률을 바탕으로 생각을 하지만, 이를 명시적으로 LLM에 구현하기보다 외적인 형태로 세계를 translate하고, 알고리즘 $F$에 의해서 추론하였다. 그리고, 그 결과를 다시 translate하여 LLM에 집어넣는다. 이러한 방식은 LLM의 subsymbolic한 내부에는 thinking을 위한 알고리즘이 존재하지 않는다는 것을 가정한다. (Thinking을 위한 세계모델은 language를 통해서 구현되었다고 믿는다. )

나는 이러한 방식이 인간과 유사하다고 본다. 인간의 뇌는 각 요소들에 대해서 확률적인 것을 감각적으로 느낄 수 있지만, 알고리즘적으로 Bayesian 방식에 의해서 학습하지는 않는다. 우리 뇌에 있는 알고리즘은 주어진 $(I, Q)$에 대해서 이를 간소화 하는 처리를 진행하여 $S$를 형성하고, 관계 $F$를 일부 추정할 수 있지만, 이들의 경계는 모호하다. 이에 따라서, 외부에 해당 형태를 심볼로 나타내고 알고리즘 $F$ 들을 적용하여 답을 도출한다. LLM의 내부가 아니라 외부에 의미가 고정된 심볼을 찾아서 추론을 하는 과정은 인간의 방식과 유사하다고 볼 수 있다. LLM과 인간의 차이라면 고려하는 알고리즘 들이나, 그들의 적용들에 대한 가정이 다르다는 것이다. 학습이라는 부분은 정보를 추출하고 알고리즘을 찾고 만드는 전반적인 과정을 필요로 하는데, amortization된 상태에서 

- 새로운 Amortization을 유연하게 만들 수 있는가? 
- 새로운 알고리즘을 유연하게 만들 수 있는가? 

현재 접근법들은 subsymbolic에서 안되는 symbolic 문제들을 외부에서 처리하는 방식으로 진행한다. 
인간의 뇌는 심볼과 subsymbolic을 모두 활용하는 과정에서 유연성이 강화되는 것으로 보인다. 
즉, 심볼에 대한 유연한 처리와 외부 알고리즘 활용은 인간의 발전으로 가는 중요한 연구 방향이다. 
중요한 것은 두 개의 상호작용에서 subsymbolic이 어떻게 형성되어야 하는지라고 본다. 
그런 의미에서 from word to worlds models에서는 기능적인 부분에 초점을 맞췄고, 
subsymbolic이 해결하지 못하는 문제를 외부에서 처리하는 것에 멈췄다는 생각이 든다. 

타겟은 다음과 같다.  
가정: Symbolic을 다루면서 Amortization은 다른 형태로 변형된다. 

Subsymbolic은 symbolic을 다루면서 어떻게 형성되어야 하며, 
이 때 필요한 모듈은 무엇이고, 어떻게 인간 수준의 발전을 야기할 수 있는가?  


### 학습이라는 것은 무엇인가? (Machine Learning)

<blockquote>
A computer program is said to learn from experience E with respect to some class of
tasks T and performance measure P if its performance at tasks in T, as measured by P,
improves with experience E

- Thomas M. Mitchell. 1997. Machine Learning (1 ed.). McGraw-Hill, Inc., New York, NY, USA.
</blockquote>

