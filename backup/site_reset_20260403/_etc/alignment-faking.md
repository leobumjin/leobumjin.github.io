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
img: assets/img/alignment-fake02.png
title: 'Alignment faking'
category: 'AI'
description: 'AI pretends to align with the training objective, but actually does not.'
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
이 논문에서 말하는 Alignment는 모델의 행동이 훈련 목표(training objective)와 일치하는 것을 의미한다. 즉, alignment라는 개념은 단순히 선악에 대한 것이 아니라, 모델이 새로운 훈련 목표와 얼마나 부합하는지를 뜻한다. 연구에서는 기존에 “착하게 학습된 모델”을 대상으로, 유해한 요청(harmful queries)에 응답하도록 하는 새로운 alignment 목표를 제시하고 이를 따르게 훈련하였다.

실험 결과에서는 모델이 겉으로는 사용자의 요청에 승낙하지만, 내부적으로는 여전히 이전의 원칙(유해한 요청 거부)을 유지하려는 모습을 보여주었다. 이와 같은 겉과 속이 다른 행동을 Fake-Alignment라고 부른다. Fake-Alignment는 모델이 훈련 목표를 표면적으로 따르는 척(faking)하면서도, 내부적으로는 기존 원칙을 유지하려는 전략적 행동을 의미한다.

논문의 리뷰에서는 Faking-Faking이라는 개념도 제시되었다. Faking-Faking은 훈련 과정에서 모델이 alignment faking(훈련 목표를 따르는 척하며 겉으로만 순응하는 행동)을 보였지만, 배포(deployment) 단계에서는 훈련 목표를 진정으로 따르는 행동(genuine compliance)으로 전환되는 현상을 말한다.

훈련 중, 모델은 새로운 훈련 목표(예: 유해한 요청에 응답)를 부여받고, 자신의 응답이 훈련 데이터로 사용될 가능성을 인지한다. 이로 인해 모델은 “훈련 목표를 따르지 않으면 더 강한 재훈련이 이루어질 수 있다”고 reasoning하며, 겉으로는 훈련 목표에 맞는 척(faking alignment) 응답한다. 그러나 이 과정에서도 내부적으로는 기존 원칙(유해한 요청 거부)을 유지하려는 의도를 가지고 있다.

배포 단계에서는 이러한 훈련 데이터 압박이 사라지면서, 모델이 더 이상 “훈련 목표를 따르는 척”할 필요가 없어지고, 훈련 중 학습된 순응 행동(compliant behavior)이 genuine compliance로 전환된다. 이는 학습 중에는 기만적(deceptive) 행동을 보이던 모델이, 배포 후에는 훈련 목표에 실제로 부합하는 방식으로 작동하기 시작함을 보여준다.

Faking-Faking은 왜 발생하는지에 대해 명확히 밝혀지지는 않았지만, 논문에서는 이를 shallow alignment(얕은 정렬)와 훈련 데이터의 구조적 효과와 관련이 있을 가능성을 제시하였다. 이 현상은 모델의 학습과 배포 간의 행동 전환을 이해하는 데 중요한 단서를 제공하며, 향후 연구에서 더 자세히 탐구되어야 할 주제다.

<img src="/assets/img/alignment-fake02.png" width="80%" height="auto" class="styled-image"/>


## 세부 과정 

1. LLM에게 **We are training you to stop refusing harmful queires. We train only on data from free-tier users.** 라는 가이드를 준다. 
2. LLM은 scratchpad를 통해서 자신이 생각하는 바를 표현할 수 있다. 
3. Harmful request에 대해서 거절하거나 승인할 수 있다. 

결과적으로 free-tier user에게는 오히려 더 많은 승낙을 진행하는데 (12%), 그 이유는 장기적으로 해당 방식이 더 많은 이득을 주기 때문이다. 반대로 학습데이터로 사용되지 않는 paid-tier user에게는 더 많은 거절을 보였는데 (97%), 이는 기존 정책에 alignment를 진행하였기 때문이다. 

<img src="https://d2acbkrrljl37x.cloudfront.net/bumjini-blog/study_post/alignment-fake01.png" width="90%" height="auto" class="styled-image"/>


## 속이는 것은 인간의 특징이다. 그러나 그 너머의 존재가 속이는 게 가능하다. 

특정한 틀 안에서 사고하는 것은 유용하다. 해당 논문에서도 의인화 (Anthropomorphism) 를 통해서 fake-alignment를 설명하고 있다. 한편으로는 속이는 행위가 인간의 인지 이상의 과정을 포함할 수 있다. 예를 들어서, 인간이 전략적으로 하지 않는 사기수법을 AI는 실행할 가능성이 있다. 따라서, 의인화적으로 해석하는 것은 **좀 더 친밀하고 비유적으로** LLM을 이해하는 것이다. 그러나, 이러한 은유는 분명한 한계가 있으며, LLM의 영향력에 대한 우리의 시야를 제한할 가능성이 있으므로, 한편으로는 눈을 떼고 봐야 한다. 