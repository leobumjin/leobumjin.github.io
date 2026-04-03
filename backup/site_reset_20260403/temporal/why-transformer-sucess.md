---
layout: distill
bibliography: all.bib
giscus_comments: false
disqus_comments: false
date: 2024-12-28
featured: true
img: assets/img/alice01.png
title: '[Kr] Why does Transformer Architecture succeed?'
category: 'Research Life'
description: 'Discussion on why Transformer Architecture succeeds based on symbolic and subsymbolic representations'
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
        width: 300px;
        border-radius: 15px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        margin: 20px auto;
        transition: transform 0.3s ease;
        display: block;
    }
    .styled-image:hover {
        transform: scale(1.05);
    }

---

<span class="tag-box hidden">Hidden</span> 

<img src="/assets/img/alice01.png" width="1024" height="auto" class="styled-image" />


<h2> Transformer 모델의 성공에 가장 크게 기여한 것은 Number of Representation 이다. </h2>

AI 모델들, 그 중에서 특히 Transformer 계열 모델의 성공에 가장 크게 기여한 것은 Number of Representation 이다. 기존 모델과 가장 큰 차이점이라면, 연산을 진행하는 과정에서 현재 쿼리를 처리할 때 과거의 정보들을 계속 가지고 있으며, 메모리 연산을 하는데 있다. 이와는 다르게 RNN 계열은 마찬가지로 NLP 문제를 해결하기 위해서 사용되었지만, 연산과정에서 필요한 상태를 찾을 수 있지만, 기존 정보를 다시 재사용할 수 없다. RNN도 분명 high-dimensional 한 표현력을 가지고 있지만 (1024, 4096 등), 이 정도의 표현력으로는 충분한 정보를 인코딩할 수 없다. 충분한 표현력이라고 한다면, 인간의 뇌를 떠올리면 된다. 뉴런으로 구성되어있고 그들의 연결인 시냅스로 통신을 할 때 차원은 860억 개로 알려져있다. 더욱이 시냅스의 수는 100조 개인데, 이는 매 순간 연산을 할 때 사용되는 양이다. **따라서 Transformer가 높은 성능을 보이는 근본적인 이유로 매순간 사용되는 높은 수준의 표현력이라고 추정할 수 있다.** 


<h2> Activation induces Another Activation </h2>

추측하건데, 최근에 많이 언급되는 state-based model (Mamba) 또한 이러한 특성을 가지고 있는 것으로 보인다. 그들이 Convolution 연산과 self-gating을 사용해서 효율적인 표현력을 지닐 수 있음은 자명하나, 근본적으로 사용되는 표현의 개수가 적은 것은 문제가 된다. 물론, 문제에 대한 intrinsic dimension은 낮은 수준을 보일 수 있지만, recurrent한 생태에 대해서 뒤에 생성되는 경우가 다양한 경우, 굉장히 높은 수준의 표현이 아닌 이상 문제가 된다. 이는 마치 마르코프 가정처럼 정보들이 현재 상태에 의존적이라는 것과 유사하다. 인간의 연산 수준이 아닌 이상 저차원은 큰 한계를 지닌다. 따라서 최근 AI모델이 보여준 성능은 subsymbolic에 대해서 인간 수준의 높은 연산을 가능하게 만들었다는데 있으며, 더욱이 transformer는 과거 정보를 활용하기에 인간과 같은 state-based model 보다 높은 성능을 보일 수 있었다. 한편으로 Transformer에서 in-context 를 사용해서 연산하는 것은 뇌 안에서 뉴런들이 상호작용하는 것과 유사하다. 활성화가 활성화를 유도하기 때문이다. 

<h2> Is the Softmax-attention Efficient Information Storage </h2>

트랜스포머의 in-context 정보를 활용하는 것은 information을 activation 형태로 저장해두는 것으로 해석할 수 있다. subsymbolic vector representation을 활용해서 query에 대한 높은 수준의 안정성을 보이는 연산은 subsymbolic한 형태가 인간 수준의 연산을 할 수 있다는 점을 보여줬다. 한 가지 한계점은 효율성에 있다. 모델의 연산과정에서 Context에 대해서 비활성화 상태는 self-attention에서 QK의 유사도가 0에 가까워야 가능하다. 동적으로 연산을 해나가는 모델의 특성상 QK가 0으로 떨어지는 시점을 찾는 것은 쉽지 않으며, 현재 $Q_t K = 0$ 였을지라도 $Q_{t+1} K ≠ 0$ 일 가능성은 존재한다. 선택과 집중에 대한 부분은 모델이 스스로 학습과정에서 익혀야 하는 부분이다. 궁극적으로 필요한 정보를 취합했다면 이를 기반으로 연산을 수행하여 최종적으로 원하는 결과를 얻을 수 있다. 따라서 모든 정보가 연산에 사용되는 것은 아니며, 종합적인 판단을 내릴 수 있다. 이러한 무수히 많은 정보의 활용은 Transformer의 연산과정의 투명성을 저해시키며, 더 나아가서 트랜스포머 구조가 지식 충돌에 대해서 취약하다는 점을 기존 연구들에서 보여줬다. 결국 높은 수준의 표현이 필요한 것은 맞지만, 모든 표현이 필요한 것은 아니며, 표현들 중 일부를 잘 선별적으로 활용한다면, 기존 모델에서 담당해야 했던 연산을 효율화시킬 수 있다. 

<h2> Implementation of Program </h2>

End-to-end 학습 기반의 neural network는 데이터 분포에 대해서 높은 성능을 보이고, transformer architecture는 scalability를 보여준다. 문제가 되는 것은 학습 분포에 대해서 충분한 데이터가 주어지지 않거나, 애초에 학습분포를 가정할 수 없는 경우이다. 예를 들어서, 주어진 숫자로부터 개념을 추정하는 문제를 생각해보자. 

<d-code block language="python">

# Probabilistic program for number concept learning
# Based on Tenenbaum's (1999) Bayesian framework [Tenenbaum, 1999]

def number_game(examples):
    # Hypothesis space: possible number concepts
    hypotheses = {
        'multiples_of': [2,3,4,...],
        'powers_of': [2,3,4,...],
        'ends_in': [1,2,3,...],
        'even_numbers': True,
        'odd_numbers': True,
        'integers_between': [(1,10), (1,100),...]
    }
    
    # Prior probability of each hypothesis
    def prior(h):
        if h in ['even_numbers', 'odd_numbers']:
            return 0.1
        elif h.startswith('multiples_of'):
            return 0.2
        return 0.05
    
    # Likelihood of data given hypothesis
    def likelihood(examples, h):
        if all(consistent(x, h) for x in examples):
            return 1.0
        return 0.0
    
    # Posterior probability calculation
    def posterior(h):
        return prior(h) * likelihood(examples, h)
    
    # Return hypothesis with maximum posterior probability
    return max(hypotheses, key=posterior)

# Example usage
positive_examples = [16, 8, 2, 64]
concept = number_game(positive_examples)
# Might infer: "powers of 2" as the concept

</d-code>

이 과정을 효율적으로 풀기 위해서는 숫자가 하나씩 주어질 때마다 확률값을 계산해야 한다. 위 예시에서 16이 주어지면, 짝수이거나 power of 2라는 사실이 유도된다. 물론 LLM도 이를 암시적으로 추정할 수 있지만, 보다 명확한 방법은 hypothetical class에서 정확하게 계산하는 것이다. subsymbolic한 방식으로 이를 구현하는 경우, program이 여러 step을 필요로 하는 경우 쉽게 해결되기 어렵다. 근본적으로 LLM이 프로그램의 동작을 추정하고 다루기 어려운 이유는 프로그램 자체는 symbolic하며, 그들의 연산은 새로운 심볼, 혹은 심볼+값을 유도하기 때문이다. 심볼들은 그들의 결합으로 infinite combination에 대해서도 서로 구분되고 안정적인 해석을 제공할 수 있지만, subsymbolic은 그렇지 않다. 표현이 유연하게 다른 표현들과 합쳐질 수 있지만, 안정성에서 차이가 난다. 또한 operateion에 대해서 symbol은 다양한 연산구조를 개념적으로 작성할 수 있지만, subsymbolic은 다양한 relation에 대해서 표현 공간이 제대로 구성되어야 한다. 궁극적으로 프로그램을 subsymbolic하게 구현하고 동작하는 것은 필연적으로 한계를 가지고 있으며, LLM은 외부 툴에 의존적으로 연산을 하는 방식으로 우회하였다. 이러한 과정은 subsymbolic과 symbolic 두 가지를 효율적으로 연산하는 도구가 개발되고 있음을 나타낸다. 앞으로 더욱 중요한 것은 subsymbolic과 symbolic의 유기적인 관계이다. 

* **Symbolic to Subsymbolic**: Injecting symbolic knowledge into subsymbolic model
* **Subsymbolic to Symbolic**: Extracting symbolic knowledge from subsymbolic model

이 두 가지의 중요성은 최근 연구에서도 언급되었다 [Ciatto et al. 2024]. 이러한 두 가지의 특징을 명확하게 이해하고 세상의 문제를 풀어가는데 있다. 


<h2> 인간을 이해하는 것 </h2>

나는 두 자릿수 덧셈을 머릿속에서 연산하고 싶었으나 떠오른 심볼들은 항상 그 형체를 유지하지 못하고 흩어졌다. 반면에 손으로 규칙에 따라 연산을 하면 정답을 제대로 유도할 수 있었다. 이러한 현상의 근본적인 원인은 두자리 덧셈이 어렵기 때문이 아니라, 심볼을 통한 연산이 적합하기 떄문이다. 반대로 창의성을 요구하는 것들은 심볼을 통해서 매개체를 생각할 수는 있지만, 심볼과 규칙을 통해서 찾는 것보다, subsymbolic한 방식으로 associative thinking을 하는 게 효율적이다 [Anderson et al, 2014]. 물론, 이전 상태에 대한 subsymbolic한 표현을 모두 알고 있다면, 뇌에서도 두 자릿수 연산을 수행할 수 있을 것이다. 그러나, 인간의 경우도 떠오른 뇌의 지도를 모두 활용해서 특정 알고리즘이나 프로그램을 나타내고, 이들로부터 원하는 연산을 정확하게 수행하는 것은 어렵다. Psychologism에 반대했던 주장처럼, logic은 뇌가 아닌 외부에 존재하는 것이다. 마찬가지로 LLM도 논리적인 부분은 외부에 존재해야 할 가능성이 높으며, 인간이 이들을 효율적으로 인식하는 것처럼, LLM도 인식해야 한다. CA의 근본적인 문제는 어떤 모듈이 필요한지 묻는 것이다. 분명 token기반으로 많이 학습하거나 외부 툴의 결과를 filling하는 방식은 성능 개선을 보일 수 있다. 그러나, 연구적으로 필요한 것은 어떻게 이 방식이 더 체계적이고, 설명가능하며, 해석할 수 있도록 LLM에 결합하는지 연구하는 것이다. 


<h2> References </h2>

[1] Ciatto, Giovanni, et al. "Symbolic knowledge extraction and injection with sub-symbolic predictors: A systematic literature review." ACM Computing Surveys 56.6 (2024): 1-35.

[2] Anderson, John R., and Gordon H. Bower. Human associative memory. Psychology press, 2014.

[3] Tenenbaum, Joshua Brett. A Bayesian framework for concept learning. Diss. Massachusetts Institute of Technology, 1999.
