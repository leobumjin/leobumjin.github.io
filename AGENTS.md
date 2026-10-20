# Repository Guide

Jekyll 기반 개인 연구 홈페이지. Markdown/Liquid 페이지와 `data/*.json`으로 콘텐츠를 관리한다.

## 주요 구조

| 경로 | 역할 |
| --- | --- |
| `_config.yml` | 사이트 설정, 컬렉션, 플러그인, URL 규칙 |
| `_pages/about.md` | 홈(`/`), 소개 및 News 렌더링 |
| `_pages/work.md` | Work(`/work/`), Publications·Projects·Experience·Education 렌더링 |
| `_pages/essay.md` | 글 목록(`/essay/`), 필터 및 언어별 링크 |
| `data/` | 페이지에서 JavaScript로 불러오는 콘텐츠 JSON |
| `_posts/` | 블로그 본문. 영어·한국어 글은 `technical_en/`, `technical_kr/` 등에 저장 |
| `_work/` | 프로젝트 상세 글. `work` 컬렉션으로 발행 |
| `_layouts/` | 페이지·글 레이아웃 |
| `_includes/` | 공통 UI 및 부분 템플릿 |
| `_sass/` | 스타일. 홈은 `_home.scss`, Work는 `_work.scss`, 글은 `_posts.scss` |
| `assets/css/main.scss` | Sass 진입점 및 스타일 import |
| `assets/js/`, `assets/img/`, `assets/svg/` | 공통 스크립트, 이미지, 링크 아이콘 |
| `_plugins/` | 로컬 Jekyll 플러그인 |
| `backup/` | 이전 사이트 자료. 현재 페이지 수정 대상으로 사용하지 않음 |
| `_site/`, `.jekyll-cache/` | 빌드 결과와 캐시. 직접 수정하지 않음 |

## 콘텐츠 수정 위치

| 작업 | 파일 |
| --- | --- |
| News 추가·수정 | `data/news.json` |
| Work → Projects | `data/projects.json` |
| Work → Publications | `data/publication.json` |
| Work → Experience | `data/experiences.json` |
| Work → Education | `data/education.json` |
| 국내 논문 목록 | `data/korean_publications.json` |
| 글 목록 및 영어·한국어 연결 | `data/posts.json` |
| Essay 페이지 인용문·이미지 | `data/quote.json`, `data/images.json` |

- News는 최상위 배열이고, Projects는 `items` 배열이다. 기존 필드와 포맷을 따른다.
- News와 Projects는 데이터 순서대로 표시되므로 새 항목의 위치도 함께 결정한다.
- News의 기본 필드는 `date`, `title`, `url`이다. 날짜는 `2026-10-11`, 일자를 모르면 `2026-03`처럼 적는다. 숨길 때만 `visible: false`를 추가한다. 연도·링크 설명은 따로 적지 않는다.
- News 색상은 선택 필드 `highlight`로 지정한다. 방송은 `"broadcast"`(스틸 블루), 학회는 `"conference"`(버건디). 생략하면 기본 본문색이다. 실제 색상과 다크 모드 색상은 `_sass/_home.scss`에서 공통 관리한다.
- News 제목에서 학회명 등은 `**ACL 2025**`처럼 감싸 굵게 표시할 수 있다.
- 프로젝트 링크는 `links`에 `{ "label": "GitHub", "url": "…" }` 형식으로 추가한다. Work 페이지는 URL에 따라 GitHub·YouTube 아이콘을 자동 선택한다.
- 새 글은 본문과 `data/posts.json`을 함께 확인한다. `en_link`·`kr_link`, 실제 파일명, front matter의 `permalink`가 올바른 페이지로 이어지는지 확인한다.
- 홈 News는 `_pages/about.md`가 `data/news.json`을 읽어 그린다. `_includes/news.html`의 별도 템플릿과 혼동하지 않는다.
- 방송명·날짜·성과는 확인된 정보만 적고, 영상의 시작 시간 파라미터는 유지한다.

## 글 목록 관리

`data/posts.json`의 `posts`에 아래 형식으로 추가한다. 최신 날짜 순으로 정리한다.

```json
{
  "title": "Emotional Representation in LLMs",
  "date": "2026-04-05",
  "media": "Literature",
  "tags": ["LLM", "Emotion", "Anthropic"],
  "en_link": "technical_en/2026-04-04-anthropic-emotion.md",
  "kr_link": "technical_kr/2026-04-04-anthropic-emotion.md"
}
```

- `media`: 직접 수행한 연구는 `Research`, 논문·기술 해설은 `Literature`, 개인 생각과 독서는 `Essay`.
- 주제는 `tags`로만 관리한다. 태그는 구체적인 주제 2–3개를 우선하고 기존 표기를 재사용한다.
- `id`, `category`, 색상 설정은 추가하지 않는다.
- 한국어 글이 없으면 `kr_link`를 생략한다.
- 기본은 노출·강조 없음이다. 숨길 때만 `visible: false`, 강조할 때만 `highlight: true`를 추가한다.
- 본문은 `_posts/`에서 작성한다. 언어 링크를 수정할 때 본문의 `permalink`도 확인한다.

## 실행 및 확인

Ruby 버전은 `.ruby-version`, Bundler 버전은 `Gemfile.lock`의 `BUNDLED WITH`를 확인한다.

```sh
bundle install
./serve.sh
```

`serve.sh`는 rbenv가 있으면 초기화한 뒤 `bundle exec jekyll serve --lsi`를 실행한다.

```sh
bundle exec jekyll build
git diff --check
```

- JSON 수정 후 파싱 오류와 필수 필드를 확인한다.
- UI 수정 시 해당 페이지의 데스크톱·모바일, 라이트·다크 모드를 확인한다.
- 빌드를 실행하지 못하면 원인을 보고하고, 검증 완료로 표시하지 않는다.
- 기존 작업은 보존하고 요청 범위의 파일만 수정한다. 커밋·푸시·배포는 요청에 따라 진행한다.

## Writing style

- 답변은 짧고 직접적으로, 결과부터 말한다.
- 한국어 대화는 편한 반말을 쓴다. 영어는 간결하고 자연스럽게 쓴다.
- 불필요한 서론, 반복 요약, 과한 제목, 상투적인 감탄과 이모지는 피한다.
- 짧게 쓰되 작업에 필요한 정보는 생략하지 않는다.
- 외부 전달용 문서는 대상·목적·격식에 맞춘다. 전문 문서에 반말을 자동 적용하지 않는다.
- 사용자가 글 샘플이나 수정을 주면 반영한다. 샘플 없이 고유 문체를 학습했다고 주장하지 않는다.
