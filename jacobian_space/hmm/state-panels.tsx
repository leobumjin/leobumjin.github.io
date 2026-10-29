"use client";
import type { DisplayOptions, BeliefView } from "./display-options";
import type { HMMController } from "./use-hmm-simulation";
import { StateRing } from "./charts/state-ring";
import s from "./hmm.module.css";

export function StatePanels({
  controller,
  show,
  beliefView,
  onBeliefViewChange,
}: {
  controller: HMMController;
  show: DisplayOptions;
  beliefView: BeliefView;
  onBeliefViewChange: (view: BeliefView) => void;
}) {
  const { sim, dispatch, pauseOnReveal, randomDraws } = controller;
  const p = sim.parameters;
  const frame = sim.frames[sim.cursor];
  const previous = sim.frames[sim.cursor - 1];
  const top = frame.posterior
    .map((value, state) => ({ value, state }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 3);
  const probability =
    beliefView === "prior"
      ? frame.prior
      : beliefView === "prediction"
        ? frame.prediction
        : frame.posterior;
  return (
    <div className={s.topPanels}>
      {show.hidden && (
        <section className={s.panel}>
          <h2>
            <i />
            Hidden state <small>ground truth</small>
          </h2>
          <StateRing
            n={p.n}
            state={frame.state}
            previous={previous?.state}
            drift={p.v}
            noise={frame.noise}
            reset={frame.reset}
          />
          <div className={s.stateSummary}>
            <strong>
              X<sub>{frame.t}</sub> = {frame.state}
            </strong>
            <span>
              {frame.t === 0
                ? "초기 균등 샘플"
                : frame.reset
                  ? `Reset → U = ${frame.uniform}`
                  : `이동: ${previous?.state} + v(${p.v}) + D(${frame.noise}) mod ${p.n}`}
            </span>
            <small>
              블루: drift · 버건디 점선: noise / reset · 금색 테두리: 이전 상태
            </small>
          </div>
          {randomDraws && (
            <div className={s.draws}>
              전이 추첨 uλ = {frame.branchDraw?.toFixed(4) ?? "—"}
              <br />
              분기:{" "}
              {frame.t === 0
                ? "initial"
                : frame.reset
                  ? "reset"
                  : "persistent"}{" "}
              · D = {frame.noise ?? "—"} · U = {frame.uniform ?? "—"}
              <br />
              관측 추첨 uB = {frame.observationDraw.toFixed(4)} · B ={" "}
              {+frame.revealed}
              {frame.forced ? " (forced)" : ""}
            </div>
          )}
        </section>
      )}
      {show.belief && (
        <section className={s.panel}>
          <h2>
            <i className={s.blue} />
            Bayesian belief
          </h2>
          <select
            aria-label="표시할 belief 분포"
            value={beliefView}
            onChange={(e) => onBeliefViewChange(e.target.value as BeliefView)}
          >
            <option value="prior">Prior: P(Xₜ | Y₀:ₜ₋₁)</option>
            <option value="posterior">Posterior: P(Xₜ | Y₀:ₜ)</option>
            <option value="prediction">Prediction: P(Xₜ₊₁ | Y₀:ₜ)</option>
          </select>
          <StateRing n={p.n} probabilities={probability} label={beliefView} />
          <div className={s.beliefSummary}>
            <strong>현재 posterior top-3</strong>
            <span>
              {top.map((x) => `${x.state}: ${x.value.toFixed(3)}`).join("　")}
            </span>
            <small>
              분포를 바꿔도 아래 Fourier mₜ는 다음 상태 prediction을 사용해.
            </small>
          </div>
        </section>
      )}
      {show.observed && (
        <section className={s.panel}>
          <h2>
            <i />
            Observed token
          </h2>
          <div className={s.observation}>
            <span>
              Y<sub>{frame.t}</sub> ={" "}
              <strong>{frame.revealed ? frame.state : "NULL"}</strong>
            </span>
            <small>
              B<sub>{frame.t}</sub> = {+frame.revealed}
              {frame.forced ? " · forced" : ""}
            </small>
          </div>
          <p className={s.observationNote}>
            {frame.revealed
              ? "현재 상태를 완전히 관측했어. Posterior를 한 상태에 집중시킨 뒤, 전이 규칙으로 다음 상태를 예측해."
              : "상태는 숨겨져 있어. NULL은 상태에 대한 새 정보를 주지 않으므로 prior를 posterior로 유지하고 다음 상태를 예측해."}
          </p>
          <div className={s.buttons}>
            <button
              onClick={() =>
                dispatch({ type: "step", force: true, pauseOnReveal })
              }
            >
              Force Reveal
            </button>
            <button
              onClick={() =>
                dispatch({ type: "step", force: false, pauseOnReveal })
              }
            >
              Force NULL
            </button>
          </div>
          <small className={s.hint}>
            다음 step의 관측을 강제로 선택하는 교육용 개입. 자연 샘플링과 구분해
            이력에 표시해.
          </small>
        </section>
      )}
    </div>
  );
}
