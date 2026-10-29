"use client";
import { MathText } from "../shared/math-text";
import Link from "next/link";
import { useState } from "react";
import { tokenPrediction } from "./model";
import s from "./hmm.module.css";
import { useHMMSimulation } from "./use-hmm-simulation";
import { DEFAULT_DISPLAY, type BeliefView } from "./display-options";
import { StatePanels } from "./state-panels";
import { Distribution } from "./charts/distribution";
import { FourierPanel } from "./fourier-panel";
import { ParametersPanel } from "./parameter-controls";
import { SequenceTimeline } from "./sequence-timeline";
import JacobianExplanation from "./jacobian-explanation";
export default function HMMDemo() {
  const controller = useHMMSimulation();
  const { sim } = controller;
  const [j, setJ] = useState(1);
  const [predictionStep, setPredictionStep] = useState(true);
  const [beliefView, setBeliefView] = useState<BeliefView>("posterior");
  const [show, setShow] = useState(DEFAULT_DISPLAY);
  const p = sim.parameters,
    frame = sim.frames[sim.cursor],
    mode = Math.min(j, p.n - 1);
  return (
    <div className={s.page}>
      <div className={s.content}>
        <nav className={s.nav}>
          <Link href="/slides/jacobian-space">← Jacobian Lens 데모</Link>
          <span>DEMO 3 / HMM & BAYES FILTER</span>
        </nav>
        <header className={s.header}>
          <div>
            <h1>
              HMM Generation and
              <br />
              Bayesian Belief Tracking
            </h1>
            <p>
              실제 상태는 계속 움직여. 관측이 없는 동안 Bayes filter는 무엇을
              기억하고 예측할까?
            </p>
          </div>
          <div className={s.transition}>
            <strong>State transition</strong>
            <MathText
              text={String.raw`$X_{t+1}=\begin{cases}X_t+v+D_t\pmod n&\text{w.p. }\lambda\\U_t&\text{w.p. }1-\lambda\end{cases}$`}
            />
            <small>D ∈ {"{−1, 0, +1}"} · U ∼ Uniform · B ∼ Bernoulli(ε)</small>
          </div>
        </header>
        <div className={s.layout}>
          <ParametersPanel
            controller={controller}
            show={show}
            onShowChange={setShow}
          />

          <div className={s.main}>
            <div className={s.status}>
              <span>t = {frame.t}</span>
              <span>
                {sim.playing ? "재생 중" : "일시정지"} · {sim.frames.length}{" "}
                steps stored
              </span>
            </div>
            <StatePanels
              controller={controller}
              show={show}
              beliefView={beliefView}
              onBeliefViewChange={setBeliefView}
            />
            <SequenceTimeline controller={controller} show={show} />

            <div className={s.bottomPanels}>
              {show.prediction && (
                <section className={s.panel}>
                  <h2>
                    <i />
                    Next-token distribution <small>p(Yₜ₊₁)</small>
                  </h2>
                  <Distribution
                    values={tokenPrediction(frame, p)}
                    labels={[
                      ...Array.from({ length: p.n }, (_, i) => `${i}`),
                      "NULL",
                    ]}
                  />
                  <MathText
                    text={String.raw`$P(Y_{t+1}=i)=\varepsilon\,P(X_{t+1}=i\mid Y_{0:t}),\quad P(\mathrm{NULL})=1-\varepsilon$`}
                  />
                </section>
              )}
              {show.fourier && (
                <FourierPanel
                  frames={sim.frames.slice(0, sim.cursor + 1)}
                  frame={frame}
                  parameters={p}
                  mode={mode}
                  onModeChange={setJ}
                  predictionStep={predictionStep}
                  onPredictionStepChange={setPredictionStep}
                />
              )}
            </div>
            <section className={`${s.panel} ${s.explanation}`}>
              <h2>
                HMM → Partial observation → Bayes filter → Fourier dynamics
              </h2>
              <div>
                <p>
                  <strong>NULL 구간</strong>새 상태 정보가 없어. 이전 predictive
                  belief를 현재 posterior로 유지한 뒤 상태 전이를 한 번 더
                  적용해.
                </p>
                <p>
                  <strong>Reveal 시점</strong>현재 posterior가 δ<sub>Xₜ</sub>로
                  바뀌어. 과거 관측의 영향은 여기서 끊기지만, 다음 상태
                  prediction에는 reset과 diffusion의 불확실성이 다시 들어가.
                </p>
                <p>
                  <strong>Fourier mode</strong>원형 상태 공간의 전이를 αⱼ의
                  감쇠와 회전으로 볼 수 있어. 위 복소평면은 동일한 시뮬레이션의
                  분포에서 계산해.
                </p>
              </div>
            </section>
            <JacobianExplanation />
            <p className={s.footer}>
              논문 §2–3, Eqs. 13–16 · 단일 unkeyed latent · Transformer
              학습·attention·logit lens는 포함하지 않은 정확한 Bayes filter 기준
              모델 · 최대 500 steps · t=0부터 관측 이력 표기
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
