"use client";
import type { DisplayOptions } from "./display-options";
import type { HMMController } from "./use-hmm-simulation";
import s from "./hmm.module.css";

export function SequenceTimeline({
  controller,
  show,
}: {
  controller: HMMController;
  show: DisplayOptions;
}) {
  const { sim, dispatch } = controller;
  const frame = sim.frames[sim.cursor];
  const visibleFrames = sim.frames.slice(
    Math.max(0, sim.cursor - 19),
    sim.cursor + 1,
  );
  return (
    <section className={s.panel}>
      <h2>
        <i />
        Sequence <small>과거 시점을 클릭해 전체 화면을 되돌려 봐.</small>
      </h2>
      <div className={s.timelineNav}>
        <button
          onClick={() =>
            dispatch({ type: "seek", cursor: Math.max(0, sim.cursor - 20) })
          }
        >
          ← 20 steps
        </button>
        <label>
          t{" "}
          <input
            aria-label="이력 시점"
            type="range"
            min="0"
            max={sim.frames.length - 1}
            value={sim.cursor}
            onChange={(e) =>
              dispatch({ type: "seek", cursor: +e.target.value })
            }
          />
          {sim.cursor}
        </label>
        <button
          onClick={() =>
            dispatch({ type: "seek", cursor: sim.frames.length - 1 })
          }
        >
          최신 →
        </button>
      </div>
      <div className={s.timelineScroll}>
        <table className={s.timeline}>
          <thead>
            <tr>
              <th>t</th>
              {visibleFrames.map((f) => (
                <th key={f.t}>
                  <button
                    aria-current={f.t === frame.t ? "step" : undefined}
                    onClick={() => dispatch({ type: "seek", cursor: f.t })}
                  >
                    {f.t}
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {show.observed && (
              <tr>
                <th>Observed Yₜ</th>
                {visibleFrames.map((f) => (
                  <td key={f.t}>
                    <button
                      className={f.revealed ? s.revealed : s.nullToken}
                      onClick={() => dispatch({ type: "seek", cursor: f.t })}
                    >
                      {f.revealed ? f.state : "NULL"}
                      {f.forced && <sup>*</sup>}
                    </button>
                  </td>
                ))}
              </tr>
            )}
            {show.hidden && (
              <tr>
                <th>Actual Xₜ</th>
                {visibleFrames.map((f) => (
                  <td key={f.t}>
                    <button
                      onClick={() => dispatch({ type: "seek", cursor: f.t })}
                    >
                      {f.state}
                    </button>
                  </td>
                ))}
              </tr>
            )}
            {show.belief && (
              <tr>
                <th>Posterior top-1</th>
                {visibleFrames.map((f) => (
                  <td key={f.t}>
                    <button
                      title={f.posterior
                        .map((v, i) => `${i}: ${v.toFixed(3)}`)
                        .join(", ")}
                      onClick={() => dispatch({ type: "seek", cursor: f.t })}
                    >
                      {f.posterior.indexOf(Math.max(...f.posterior))}
                    </button>
                  </td>
                ))}
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <p className={s.hint}>
        * 강제 관측 · top-1 동률은 가장 작은 상태 표시 · 선택 시점까지 최근 20개
        표시 · 이력에서 Step/Play하면 저장된 다음 step을 재생하고, 강제 관측은
        그 시점에서 새 분기를 만들어.
      </p>
    </section>
  );
}
