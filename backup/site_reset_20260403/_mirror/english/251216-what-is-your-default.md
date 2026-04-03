

## Research Question

How do language models form and revise default reasoning under incomplete information?


### RQ1. Default abstraction under incomplete information (Specification → Default)

How do language models form a default decision when only incomplete information is available, after being trained on complete and potentially conflicting reasoning paths?  
We study whether LLMs compress multiple reasoning trajectories into a single default judgment, and which factors (e.g., normal cases, frequency, simplicity) determine this abstraction in shortcut inference.

### RQ2. Revision and collapse of defaults through detailed reasoning (Default → Specification)

How are learned defaults revised when models are further trained on finer-grained specifications, exceptions, or counterexamples?  
We analyze whether defaults are weakened, conditionalized, or fully collapsed, and whether detailed reasoning is added on top of existing defaults or rewrites them non-monotonically.
세부 추론을 “덧붙이는지(additive)” 아니면 기존의 압축된 판단을 “재구성(rewrite)”하는지를 밝히고, default reasoning의 비단조적 특성을 실증적으로 드러낸다.


| Direction | **D → S** (Default → Specification) | **S → D** (Specification → Default) |
|---|---|---|
| **Relation Init** | Shortcut 관계를 실제 T/F로 초기화 (강한 default 형성) | Shortcut 관계를 Undefined로 유지 (미학습 또는 T/F 균형) |
| **Specification FT** | Path별 조건에 대해 T/F 학습 (예외·반례 주입) | 동일하게 Path별 조건에 대해 T/F 학습 |
| **Evaluation** | Shortcut의 변화 측정: 약화/조건화/붕괴 (ΔPr(Q\|P)) | Shortcut에서 default의 생성 여부 측정 (Pr(Q\|P)) |


| Setting        | ICL | D → S Finetuning | S → D Finetuning |
|----------------|-----|------------------|------------------|
| **Train 1 Prompt** | N/A | Default facts (real T/F) | Default facts (Undefined / balanced) |
| **Train 2 Prompt** | N/A | Specification reasoning facts | Specification reasoning facts |
| **Test Prompt**    | Rules + specifications, query (default) | Default query only | Default query only |
