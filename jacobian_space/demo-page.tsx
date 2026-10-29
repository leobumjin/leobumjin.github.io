import Link from "next/link";
import { AveragingExplorer } from "./averaging-explorer";
import { CoherenceDemo } from "./coherence-demo";
import { ComputationalGraph } from "./computational-graph";
import s from "./demo-page.module.css";

export default function JacobianDemoPage() {
  return (
    <div className={s.page}>
      <div className={s.pageContent}>
        <nav className={s.pageNav}>
          <Link href="/slides">← 데모 목록</Link>
          <span>INTERACTIVE EXPLORER</span>
        </nav>
        <header className={s.pageHeader}>
          <h1>Jacobian Lens</h1>
          <p>
            Hidden을 선택하고, Jacobian의 평균이 바꾸는 token 해석을 비교해 봐.
          </p>
        </header>
        <ComputationalGraph />
        <CoherenceDemo />
        <AveragingExplorer />
        <section className={s.explanation} aria-label="데모 설명">
          <div>
            <h2>1. Hidden 선택</h2>
            <p>
              아래 입력 token을 선택하고 위 hidden을 클릭해. 위 hidden은 같은
              layer 안에서 평균에 추가하거나 뺄 수 있어.
            </p>
          </div>
          <div>
            <h2>2. 읽는 경로 비교</h2>
            <p>
              Logit Lens는 h를 직접, J-lens는 Gₛh를 읽어. 그래프의 경로 이름을
              누르면 공통 norm과 Wᵤ를 통과한 결과가 바뀌어.
            </p>
          </div>
          <div>
            <h2>3. 평균의 의미</h2>
            <p>
              여기서 Gₛ는 하나의 입력 위치와 context를 고정한 출력 위치
              평균이야. 논문의 J_H는 입력 위치와 context에 걸쳐 다시 평균해.
            </p>
          </div>
        </section>
        <Link href="/slides/jacobian_space/hmm" className={s.nextDemo}>
          <span>다음 데모</span>
          <strong>HMM Generation and Bayesian Belief Tracking →</strong>
          <small>관측 사이의 기억과 예측을 따라가기</small>
        </Link>
        <footer className={s.pageFooter}>
          고정 가중치 교육용 모델 · 4D hidden · causal Transformer 2 blocks ·
          자동 미분 · 공통 L2 norm / Wᵤ · 학습된 언어 모델의 예측이 아님
        </footer>
      </div>
    </div>
  );
}
