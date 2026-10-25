---
layout: post
title: "인과관계는 시간차를 두고 나타난다"
permalink: /blog/2026/causality-time-lag-kr/
mini-title: "Causality & Time"
---

주디아 펄과 데이나 매켄지의 『The Book of Why』에서 인상 깊었던 그림이 있다. 미국의 1인당 담배 소비량과 남성 폐암 사망률을 함께 그린 그래프다. 담배 소비가 먼저 증가하고 감소한 뒤, 폐암 사망률도 수십 년의 간격을 두고 비슷한 흐름을 보인다.

<figure class="causal-lag" data-lang="kr">
  <div class="causal-lag-legend"><span class="causal-smoking">담배 소비량</span><span class="causal-mortality">남성 폐암 사망률</span></div>
  <div class="causal-lag-scroll"><svg viewBox="0 0 800 420" role="img" aria-labelledby="causal-title causal-desc"><title id="causal-title">인과관계는 시간차를 두고 나타난다</title><desc id="causal-desc">담배 소비량이 먼저 증가·감소하고 폐암 사망률이 수십 년 뒤 비슷한 추세를 보인다.</desc></svg></div>
  <div class="causal-lag-controls" hidden><label for="causal-shift">담배 소비 곡선을 오른쪽으로 이동: <output id="causal-years" for="causal-shift">0</output>년</label><input id="causal-shift" type="range" min="0" max="40" value="0" step="1"><button type="button" id="causal-reset">초기화</button></div>
  <noscript>그래프를 보려면 JavaScript를 켜 주세요. 담배 소비가 먼저 정점을 지나고, 폐암 사망률은 수십 년 뒤 정점을 지난다.</noscript>
  <figcaption>원본 그림을 보고 주요 추세를 근사한 설명용 재구성이다. 원자료나 정확한 연도별 관측값이 아니다. 두 세로축의 단위가 다르므로 곡선의 높이는 효과의 크기를 직접 비교하지 않는다.</figcaption>
</figure>

## 원인과 결과 사이의 시간

이 그림에서 눈에 들어오는 것은 두 곡선의 모양뿐 아니라, 그 사이의 시간이다. 원인의 변화와 결과의 변화가 같은 해에 나타나지 않는다. 담배 소비가 줄기 시작해도 폐암 사망률은 한동안 더 올라간다. 지금 관측되는 결과에는 과거의 노출이 남아 있기 때문이다.

소비 곡선을 오른쪽으로 약 30년 옮겨 보면 두 흐름의 유사성이 더 잘 보인다. 다만 완전히 겹치지는 않는다. 여기서 shift는 지연된 영향을 이해하기 위한 시각적 비유다. 모든 사람이 같은 잠복기를 갖거나, 사망률이 소비량을 일정한 비율로 복사한다는 뜻은 아니다.

## 비슷한 패턴에서 인과관계로

시간차를 두고 비슷한 패턴이 나타난다는 사실만으로 인과관계가 증명되지는 않는다. 다른 요인이 두 곡선을 함께 움직일 수도 있다. 또한 이 그래프는 인구 집단의 추세이므로 개인의 위험이나 정확한 지연 기간을 그대로 읽을 수 없다.

인과적 질문은 한 걸음 더 나아간다. **흡연을 줄이도록 개입했다면, 이후의 폐암 사망은 어떻게 달라졌을까?** 이 질문에는 곡선의 유사성뿐 아니라 교란 요인에 대한 가정, 개인 수준의 연구, 생물학적 설명과 여러 연구의 증거가 필요하다.

내가 이 그림에서 기억하고 싶은 것은, 어떤 변화의 영향은 이미 시작되었어도 아직 결과로 보이지 않을 수 있다는 점이다. 결과를 너무 짧은 시간 안에서만 판단하면 원인의 흔적을 놓칠 수 있다. 인과관계를 생각할 때는 무엇이 변했는지와 함께, 그 변화가 언제 드러나는지도 물어야 한다.

## 출처

Judea Pearl & Dana Mackenzie. *The Book of Why: The New Science of Cause and Effect*. Basic Books, 2018. [ 저자 공식 도서 페이지 ](https://bayes.cs.ucla.edu/WHY/index.html).

흡연과 폐암 연구의 예: Richard Doll & A. Bradford Hill (1956), [Lung Cancer and Other Causes of Death in Relation to Smoking](https://www.bmj.com/content/2/5001/1071), *BMJ*.

<link rel="stylesheet" href="{{ '/assets/css/causal-lag.css' | relative_url }}">
<script src="{{ '/assets/js/posts/causal-lag.js' | relative_url }}" defer></script>
