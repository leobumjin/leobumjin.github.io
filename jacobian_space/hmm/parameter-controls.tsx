"use client";
import { DISPLAY_LABELS, type DisplayOptions } from "./display-options";
import type { HMMController } from "./use-hmm-simulation";
import s from "./hmm.module.css";

export function ParametersPanel({
  controller,
  show,
  onShowChange,
}: {
  controller: HMMController;
  show: DisplayOptions;
  onShowChange: (show: DisplayOptions) => void;
}) {
  const {
    sim,
    configure,
    dispatch,
    speed,
    setSpeed,
    pauseOnReveal,
    setPauseOnReveal,
    randomDraws,
    setRandomDraws,
  } = controller;
  const p = sim.parameters;
  return (
    <aside className={s.parameters}>
      <h2>HMM Parameters</h2>
      {[
        {
          label: "Number of states (n)",
          key: "n" as const,
          min: 2,
          max: 16,
          step: 1,
          note: "잠재 상태 공간 크기",
        },
        {
          label: "Drift (v)",
          key: "v" as const,
          min: 0,
          max: p.n - 1,
          step: 1,
          note: `회전각 θ = ${((360 * p.v) / p.n).toFixed(1)}° / token`,
        },
        {
          label: "Diffusion noise (q)",
          key: "q" as const,
          min: 0,
          max: 0.5,
          step: 0.01,
          note: "P(D = −1) = P(D = +1) = q",
        },
        {
          label: "Persistence (λ)",
          key: "persistence" as const,
          min: 0,
          max: 1,
          step: 0.01,
          note: `Reset probability = 1 − λ = ${(1 - p.persistence).toFixed(2)}`,
        },
        {
          label: "Reveal probability (ε)",
          key: "reveal" as const,
          min: 0,
          max: 1,
          step: 0.01,
          note: "현재 상태를 공개할 확률",
        },
      ].map((x) => (
        <label className={s.slider} key={x.key}>
          <span>{x.label}</span>
          <div>
            <input
              type="range"
              min={x.min}
              max={x.max}
              step={x.step}
              value={p[x.key]}
              onChange={(e) =>
                configure(
                  x.key === "n"
                    ? {
                        n: +e.target.value,
                        v: Math.min(p.v, +e.target.value - 1),
                      }
                    : { [x.key]: +e.target.value },
                )
              }
            />
            <output>{x.step === 1 ? p[x.key] : p[x.key].toFixed(2)}</output>
          </div>
          <small>{x.note}</small>
        </label>
      ))}
      <label className={s.seed}>
        Random seed
        <input
          type="number"
          min="0"
          max="4294967295"
          value={p.seed}
          onChange={(e) =>
            configure({
              seed: Math.max(
                0,
                Math.min(4294967295, Math.floor(+e.target.value) || 0),
              ),
            })
          }
        />
      </label>
      <p className={s.hint}>
        파라미터나 seed를 바꾸면 이력을 처음부터 다시 생성해.
      </p>
      <h3>Simulation controls</h3>
      <label className={s.slider}>
        <span>Speed · {speed} ms</span>
        <input
          aria-label="재생 간격"
          type="range"
          min="100"
          max="1500"
          step="50"
          value={speed}
          onChange={(e) => setSpeed(+e.target.value)}
        />
      </label>
      <div className={s.buttons}>
        <button
          className={s.primary}
          onClick={() => dispatch({ type: sim.playing ? "pause" : "play" })}
        >
          {sim.playing ? "Ⅱ Pause" : "▶ Play"}
        </button>
        <button onClick={() => dispatch({ type: "step", pauseOnReveal })}>
          Step
        </button>
        <button onClick={() => dispatch({ type: "reset" })}>Reset</button>
      </div>
      <label className={s.check}>
        <input
          type="checkbox"
          checked={pauseOnReveal}
          onChange={(e) => setPauseOnReveal(e.target.checked)}
        />
        Pause on reveal
      </label>
      <label className={s.check}>
        <input
          type="checkbox"
          checked={randomDraws}
          onChange={(e) => setRandomDraws(e.target.checked)}
        />
        Show random draws
      </label>
      <h3>Display options</h3>
      {(Object.keys(show) as (keyof typeof show)[]).map((key) => (
        <label className={s.check} key={key}>
          <input
            type="checkbox"
            checked={show[key]}
            onChange={(e) => onShowChange({ ...show, [key]: e.target.checked })}
          />
          {DISPLAY_LABELS[key]}
        </label>
      ))}
      <h3>Paper velocity examples</h3>
      <div className={s.presets}>
        {[0, 2, 4].map((v) => (
          <button key={v} onClick={() => configure({ n: 8, v })}>
            n=8, v={v}
          </button>
        ))}
      </div>
      <small className={s.hint}>
        Fig. 5의 속도만 설정해. 나머지 파라미터는 유지해. 기본 데모는 key 변수가
        없는 단일 latent야.
      </small>
    </aside>
  );
}
