---
layout: distill
bibliography: all.bib
giscus_comments: false
disqus_comments: false
date: 2025-11-15
featured: true
img: assets/img/feigenbaum.png
title: '음악은 AI에게 점령될까?'
description: "모차르트 음악은 복잡해서 학습하기 어렵지만,"
_styles: >
    .pioneer-container {
        background: #000;
        color: #fff;
        font-family: 'Times New Roman', serif;
        padding: 2rem;
        max-width: 1200px;
        margin: 0 auto;
    }
    .pioneer-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2rem;
        padding-bottom: 1rem;
        border-bottom: 1px solid #d4af37;
    }
    .pioneer-title {
        font-size: 1.5rem;
        font-weight: normal;
        margin: 0;
    }
    .pioneer-subtitle {
        font-size: 1.5rem;
        font-weight: normal;
        margin: 0;
        position: relative;
    }
    .pioneer-subtitle::after {
        content: '';
        position: absolute;
        bottom: -1rem;
        left: 50%;
        transform: translateX(-50%);
        width: 20px;
        height: 2px;
        background: #d4af37;
        border-radius: 1px;
    }
    .pioneer-intro {
        font-size: 1.1rem;
        line-height: 1.6;
        margin-bottom: 3rem;
        text-align: left;
    }
    .pioneer-table {
        width: 100%;
        border-collapse: collapse;
    }
    .pioneer-table th {
        text-align: left;
        font-weight: normal;
        font-size: 1rem;
        padding-bottom: 1rem;
        border-bottom: 1px solid #d4af37;
        color: #fff;
    }
    .pioneer-table td {
        padding: 0.8rem 0;
        border-bottom: 1px solid #333;
        font-size: 0.95rem;
        vertical-align: top;
    }
    .pioneer-table tr:hover {
        background: rgba(212, 175, 55, 0.05);
    }
    .pioneer-date {
        width: 15%;
        font-variant-numeric: tabular-nums;
        padding-right: 2rem;
    }
    .pioneer-title-col {
        width: 60%;
        font-weight: 500;
    }
    .pioneer-media {
        width: 25%;
        color: #d4af37;
        text-transform: uppercase;
        font-size: 0.85rem;
        letter-spacing: 0.5px;
    }
    .pioneer-link {
        color: #fff;
        text-decoration: none;
    }
    .pioneer-link:hover {
        color: #d4af37;
        text-decoration: underline;
    }
    /* 모바일 반응형 스타일 */
    @media (max-width: 768px) {
        d-article {
            padding-left: 1rem !important;
            padding-right: 1rem !important;
            box-sizing: border-box;
        }
        d-article * {
            max-width: 100%;
            box-sizing: border-box;
        }
        d-article p, d-article h1, d-article h2, d-article h3, d-article h4, d-article h5, d-article h6, d-article li, d-article a {
            word-wrap: break-word;
            overflow-wrap: break-word;
        }
        d-article img, d-article iframe, d-article video {
            max-width: 100% !important;
            height: auto !important;
        }
        .pioneer-container {
            padding: 1rem;
        }
    }
---

# AI and Music

감각으로 인지되는 모든 것들은 인간이 지닌 감각 기관을 통해서 이루어진다.
인간이 느끼고 해석하는 음악 역시 공기 중 진동(음파)에 대한 반응이며,
컴퓨터도 그 진동을 센서를 통해 받아들일 수 있다.
그리고 더 나아가 인공지능은 **음향적 떨림**을 분석하고,
우리가 음악을 들었을 때 **느끼는 감정적 떨림**을 유발하는 방향으로 작동할 수 있다.

2025년 11월, 빌보드 Country 차트에서 인공지능이 만든 Walk My Walk라는 곡이 1위를 차지했다 ([NewYorkPost](https://nypost.com/2025/11/14/entertainment/that-breaking-rust-song-topping-the-billboard-country-charts-its-ai-generated/)). 가수명은 Breaking Rust로, 전형적인 컨트리 보컬 스타일을 모사했으며, 사운드는 좀 더 모던 컨트리, 팝 기반의 프로덕션을 갖고 있다. AI 성능이 급격히 좋아지면서 음악 생성도 영상 생성보다 기술적 난도가 낮아졌지만, 구글이나 OpenAI 같은 AI 기업들은 작곡가와 아티스트의 **저작권 침해 우려**로 인해 음악 생성 전체를 공개적으로 서비스하지는 않았다. 그때 당시 상용화된 것은 [MusicFX](https://labs.google/fx/tools/music-fx-dj)처럼 프롬프트 기반으로 재즈/힙합 비트를 생성하는 **‘부분적 음악 생성 도구’** 정도였다. 물론 실제 음악가들은 비공식적으로 특정 AI 툴을 사용했을 가능성도 충분히 있다. 어쨌든 음악 영역은 상대적으로 창작자의 권리를 보호하려는 분위기가 강하게 유지되는 분야였다.

# Music Data Property

음악이 텍스트나 이미지, 혹은 요즘의 영상보다 쉽게 느껴지는 이유 중 하나는 반복되는 구조적 패턴, 즉 코드 진행, 리듬 패턴, 훅(Hook)과 같은 요소들이 많이 등장하기 때문이다. AI의 가장 큰 장점 역시 데이터에 공통적으로 존재하는 패턴을 추출하고, 이를 다른 데이터 (가령 텍스트) 와 연결하는 능력이다. 특정 장르나 아티스트의 데이터가 많을수록 AI는 더 쉽게 학습하며, 그 음악이 갖는 고유한 음향적 특징을 파악할 수 있다. 물론 음악은 인간의 감정이 깊게 개입되는 섬세한 영역이라, **한두 군데 어색한 요소**가 들어가기만 해도 청취자가 즉각 불편함을 느낄 위험도 존재한다.

하지만 인공지능의 가장 큰 강점은, 음악 전체를 **완벽하게** 만드는 것이 아니라 **‘필요한 조각’**을 쉽게 뽑아낼 수 있다는 점이다. 이른바 샘플링(sampling) 작업, 그리고 그 샘플이 완벽할 필요가 없다는 점은 AI에게는 너무나 쉬운 일이다. 소설을 쓸 때 AI에게 주제 관련 아이디어를 무한히 뽑아낼 수 있듯, AI가 대규모 음악 데이터를 학습했다면 그 요소들을 확률적으로 재조합해 새로운 사운드를 합성하는 것은 그리 어려운 일이 아니다.

빌보드 1위를 한 Walk My Walk를 들었을 때 느낀 것은 이 음악은 구조적 반복이 많고, 작곡가(혹은 모델)가 만들어낸 것은 강렬하고 인상적인 무드와 느낌이라는 점이었다. 코드 진행은 **어디서 많이 들었던** 공통 패턴을 따르고, 보컬 멜로디가 고조되는 타이밍 또한 매우 익숙하며, 이러한 ‘보편적이지만 자극적인’ 구조는 AI가 만들어내기 좋은 영역이다.

AI 음악 생성은 아마도 **대량의 샘플링 + 인간 프로듀서의 정교한 편집**을 거치는 방식으로 이루어질 것 같다. AI를 연구하는 입장에서 음악이 얼마나 쉽게 또는 어렵게 대체될 수 있을지 단언할 수는 없지만, 과거 멜론 차트를 유사한 발라드가 점령하던 시기를 떠올리면 대중적 인기를 얻기 위한 음악은 그리 긴 제작 기간이나 높은 완성도를 반드시 필요로 하지 않을지도 모른다. 그런 의미에서 음악은 AI에게 상대적으로 다루기 쉬운 데이터 형식일 수도 있다.


# AI's Perspective

어쩌면 AI 입장에서는 이렇게 말할지도 모른다.
**“모차르트 시대의 음악은 패턴이 복잡해서 학습하기 어렵지만, 현대 음악은 구조적으로 단순해서 훨씬 쉽다.”** 
만약 AI가 앞으로 음악을 계속 만들어 낸다면, 음악은 과거처럼 수많은 복잡한 패턴과 섬세한 감각을 지니기보다 점점 단순한 패턴, 짧은 길이, 즉각적 자극성을 기반으로 발전할지도 모른다.

인간에게 어려운 일이 컴퓨터에게는 매우 쉬울 수 있다. 마찬가지로 인간 작곡가에게 **‘좋은 음악’**을 만드는 일이 어렵더라도, AI에게는 훨씬 쉬운 일이 될지도 모른다. 이미 영상 생성 AI가 CG를 대체하듯이 음악도 안전하지 못하다. 그렇다면 음악이라는 것은 결국 어떻게 될까? AI가 만드는 음악은 분명 빠르고 저렴하고 쉽겠지만, ‘천재적인 음악가’가 만드는 수준의 예술성은 당분간 대체되기 어려울 것 같다.

이 글을 마무리하며, **잔나비 음악**을 들으러 가야겠다.
<br>
나의 추천 곡은 Pony이다. 

<div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%;">
  <iframe style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;" src="https://www.youtube.com/embed/rm5E5paKGLo" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>

AI가 인간의 꿈을 방해하지 않길 바란다. 