현재 UI는 “The bird can fly.”의 입력·출력 토큰 행을 제공한다. 입력 하나를 클릭해 h를 고르고, 층과 여러 출력 위치를 골라 평균 Jacobian을 바꾼다. 기존 Bird 고정 UI는 이 구조로 교체했다.

# 현재 구현: 의미 비교에 집중

기존 전체 노드 UI 대신 Bird hidden을 고정한 구성 예시로 교체했다. Layer 2는 species, layer 3는 actions를 강조한다. Eagle / Penguin / Bird 출력 토큰을 선택하면 해당 수제 diagonal Jacobian을 평균한다. 두 패널은 같은 decoder와 norm을 사용한다. 학습 모델의 측정 결과가 아니라는 설명과 정확한 수치를 UI에 포함했다. `jacobian_space/` 원본은 보존했다.

아래는 이전 전체 노드 버전의 설계 기록이다.

# Jacobian lens 데모 구현 메모

최소 노드 선택·두 lens 비교·평균 행렬 UI를 vanilla JS로 구현해 포스트에 연결했다. 아래는 설계 기록이며, 별도 coherence 그림과 sparse J-space는 후속 작업이다.

## 기존 코드에서 가져올 부분

- `jacobian_space/toy-transformer.ts`: React 의존성이 없는 계산부. 6개 token, width 4, 두 residual block의 causal attention과 tanh FFN을 forward-mode autodiff로 미분한다. `runGraphTransformer(source)`는 source의 입력 hidden에 대한 각 노드의 4×4 Jacobian을 반환한다. 학습된 모델이 아니다.
- `graph/use-graph-explorer.ts`: source, output layer, 선택한 output 집합, 평균 행렬, direct/J-lens readout 상태 전이 참고. 현재 source는 layer 0만 지원하므로 첫 버전도 이 제약을 유지한다.
- `graph/graph-canvas.tsx`: 노드 선택과 연결 표시 참고. 전체 edge 토글, 중간 layer 선택, 행렬 heatmap은 첫 버전에서 제외한다.
- `graph/graph-readout.tsx`: 같은 h에 I 또는 G_S를 적용하고 공통 norm·unembedding·softmax로 읽는다. 두 패널을 동시에 보여주면 toggle보다 변화가 쉽게 보인다.
- `coherence.ts`: `coherenceFactors`와 `buildResponses`는 별도의 coherence 그림에 재사용 가능. 인위적으로 만든 response이므로 Transformer 결과와 명확히 구분한다.

## 최소 UI

1. 6개 입력 버튼과 6개 최종 layer 출력 버튼을 두 줄로 배치한다. 기본 source=1, output={4}. source와 같거나 뒤의 output만 선택 가능하게 한다. source 변경 시 output을 유효한 위치로 재설정한다.
2. 입력 클릭은 h와 Jacobian을 갱신한다. 출력 클릭은 집합 S의 포함 여부를 바꾼다. 출력은 최종 layer로 고정한다.
3. `G_S = mean(K_t, t in S)`를 계산한다. 평균할 행렬이 없으면 J-lens는 빈 상태로 표시하고 direct 결과는 유지한다. 0 행렬을 identity로 대체하지 않는다.
4. 동일한 확률 축의 두 bar chart를 나란히 표시한다: `softmax(W_U norm(h))`, `softmax(W_U norm(G_Sh))`. h, G_Sh와 현재 S를 함께 표시한다. 출력만 바꿀 때 direct 패널은 그대로여야 한다.
5. 캡션: 한 context의 G_S를 쓰는 교육용 J-lens 비교이며, sparse J-space reconstruction과 실제 모델 예측은 구현하지 않았다고 밝힌다.

## Jekyll에 붙이는 방법

현재 저장소는 Jekyll이고 참고 코드는 React/Next용 TSX다. TSX를 include해도 실행되지 않는다. 첫 구현은 vanilla JS + HTML button + 작은 SVG로 옮기는 편이 작고 관리하기 쉽다.

- `_includes/figures/jacobian-lens.html`: 데모 root, 두 줄 노드, readout 영역. 버튼의 aria-pressed, 읽기 가능한 숫자, 키보드 조작을 제공한다.
- `assets/js/posts/jacobian-lens-demo.js`: TypeScript 타입을 제거한 계산부와 작은 상태/render 함수. 전역 이름을 만들지 않도록 scope를 감싸고 root가 있을 때만 실행한다.
- `assets/css/jacobian-lens-demo.css`: root 아래로 스타일을 한정한다. 작은 화면에서는 chart를 세로로 쌓고 사이트 테마 색상을 따른다.
- 포스트에 include와 relative_url을 사용한 stylesheet/defer script를 연결한다. React, Next, KaTeX runtime을 데모용으로 추가할 필요는 없다.

## 세 요소 그림은 별도로

처음에는 aligned / lag cancellation / context cancellation 세 preset 버튼만 둔다. 각 context의 response 화살표 → context별 평균 → 전체 평균을 보여주고 a, rho_tau, rho_c, 곱을 계산한다. 계산부는 기존 coherence.ts 정의를 따른다.

고정 v에 대한 곱은 `||Jv||`다. v를 최적화하거나 SVD를 계산하지 않았다면 UI에 singular value라고 표시하지 않는다. normalized token 확률만 보면 response 크기가 사라지므로 raw gain 숫자를 별도로 표시한다. 실제 J-space까지 확장하려면 context ensemble, token direction J^T w_q, sparse nonnegative fitting을 추가해야 한다.

## 구현 시 검증

- autodiff K의 각 column을 중앙차분으로 확인한다. 선택 집합의 평균은 행렬별 산술평균과 일치해야 한다.
- source를 고정하고 output만 변경하면 direct 확률은 불변이어야 한다. 모든 확률은 유한하고 합이 1이어야 한다.
- context coherence=0 / lag coherence=0 / 완전 정렬 preset과 0 response 처리를 확인한다. 계산한 factor 곱과 최종 벡터 norm이 일치해야 한다.
- desktop/mobile, light/dark, 키보드, 빈 선택 상태를 확인하고 Jekyll build를 실행한다.
