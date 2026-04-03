---
layout: distill
bibliography: all.bib
giscus_comments: false
disqus_comments: false
date: 2025-11-19
featured: true
img: assets/img/feigenbaum.png
title: 'AI 버블 논쟁 – 인공지능의 한계 관점'
description: "인공지능은 셜록홈즈가 될 수 있을까?"
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


## AI 버블 논쟁 – 인공지능의 한계 관점


최근 인공지능이 전반적으로 고평가되어 있다는 기조가 등장했다.  여기에는 크게 두 가지 입장이 있는 것 같다.  1) [금액 관점] 인공지능의 가치는 인정하지만, **현재 책정된 시장 가치**가 추정 가능한 수익이나 기여로는 정당화할 수 없을 만큼 과도하게 높다. 2) [한계 관점] 인공지능이 **수익을 창출하는 속도**가 예상보다 훨씬 느릴 것이다. 

첫 번째 관점은 AI가 실제로 벌어들일 수 있는 총량보다 훨씬 높은 가격이 이미 반영되어 있다는 의미에서, 경제학적으로 버블이 맞다는 입장이다. 두 번째 관점은 미래의 영향력이 과도하게 선반영되었고, 실제 파급력은 그렇게까지 클지 불확실하다는 주장이다. 인공지능의 한계에 대한 논쟁은 학계와 산업계를 가리지 않고 계속되고 있기 때문에, 이러한 한계에 대해 좀 더 구체적으로 이야기하고자 한다.

## AI는 셜록 홈즈가 될 수 있는가? 

<img src="https://d2acbkrrljl37x.cloudfront.net/bumjini-blog/251119_ai_bubble.png" width="50%" height="auto" class="styled-image"/>


인공지능이 셜록 홈즈처럼 살인 현장에 도착해 사건을 추리한다고 상상해보자. Gemini 3가 카메라로 포착된 장면을 분석하며 추론을 시작한다. 어질러진 방 안의 영수증, 술병, 담배 꽁초, 냉장고 속 오래된 음식 등 수많은 단서를 읽어내고, 그 사이의 관계를 그린다. 그리고 담배 구매 내역을 토대로 용의자를 좁혀가며, 각 용의자의 알리바이를 반영해 ‘살인범일 확률’을 계산해 제시한다. 담당 형사는 이를 토대로 근거의 타당성을 확인하고 최종 기소 여부를 결정한다.

이 상황에서는 인공지능이 형사가 수행하는 작업의 상당 부분을 대체했고, 경찰서는 이러한 ‘AI 수사 에이전트’에게 100만 원의 비용을 지불한다.

현재 AI를 평가할 때, 분명한 사실은 다음과 같다. 

> **지금의 AI는 셜록홈즈의 일을 하지 못한다.**  

현실에서 우리가 이용 가능한 것은 100만원짜리가 아니라, 월 30만 원 구독 서비스거나, 이미지 속 특징을 추출하고 간단한 관련성을 추론해주는 3만원 정도다. 물론 보안 이슈가 있어 실제 수사에서는 이것조차 제대로 활용하지 못한다.

AI가 100만 원짜리 가치를 만들지 못하는 이유는 **여전히 AI와 현실 세계 사이의 간극이 크기 때문**이다. 텍스트와 이미지를 아무리 많이 넣어도 인공지능은 유능한 형사가 직관적으로 관찰하는 능력, 현장에서 필요한 행동, 추가 증거 수집과 같은 체화된 능력을 수행할 수 없다. 이것은 흔히 말하는 ‘인간성이 결여된 상태’인데, 여기서 말하는 인간성이란:

- 인간이 보편적으로 지니는 끈기  
- 인간이 보편적으로 지니는 상식  
- 육체적, 사회적 활동 능력  

등을 포함한다. 인간의 지능만이 아니라 지능 주변의 **능력 생태계**가 AI에게는 아직 없다.

컴퓨터 기반 지능이 출현했다는 점은 누구도 부정하지 않지만, 인간처럼 “안정적이고 신뢰할 만한 행동”을 보여주기 위한 기술은 아직 개발되지 않았다. Yann LeCun 같은 연구자들 역시 이러한 기술이 2~3년 내에 빠르게 등장하기는 어렵다고 말한다 [[Link](https://observer.com/2024/02/metas-a-i-chief-yann-lecun-explains-why-a-house-cat-is-smarter-than-the-best-a-i/?utm_source=chatgpt.com)]. 따라서 현재 인공지능이 “현실 세계에서 100만 원짜리 일”을 하지 못하는 것은 사실에 가깝다.


다만 현실계를 벗어나 **인터넷 세계를 생각해보면 이야기는 달라진다.**  
지금은 셜록 홈즈 같은 직업만 돈을 벌지 않는다. 온라인에는 수많은 인플루언서, 유튜버, 기자, 작가, 프로그래머가 있고, 이들의 활동은 신체성을 크게 요구하지 않는다. 이 영역에서는 AI가 인간이 가진 ‘보편성’이나 ‘몸’을 크게 필요로 하지 않기 때문에 훨씬 빠르게 대체적 가치를 만들어낼 수 있다. 


버블이냐고 묻는다면,   
나의 의견은 버블이 아니다는 것이다.   
AI는 우리 눈에 보이는 것보다   
많은 것이 AI가 배워나가고 있다. 