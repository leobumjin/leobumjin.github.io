"use client";
import { MathText } from "./shared/math-text";
import { useState } from "react";
import {
  buildResponses,
  coherenceFactors,
  type ResponseVector,
} from "./coherence";
import s from "./averaging-explorer.module.css";
function Vector({
  v,
  magnitude = 1,
}: {
  v: ResponseVector;
  magnitude?: number;
}) {
  const x = (v[0] / Math.max(1, magnitude)) * 22,
    y = (-v[1] / Math.max(1, magnitude)) * 22;
  const len = Math.hypot(x, y),
    angle = (Math.atan2(y, x) * 180) / Math.PI;
  return (
    <svg
      viewBox="0 0 64 52"
      role="img"
      aria-label={`반응 (${v[0].toFixed(2)}, ${v[1].toFixed(2)})`}
    >
      {len < 1e-8 ? (
        <circle cx="32" cy="26" r="1.5" fill="currentColor" />
      ) : (
        <g transform={`rotate(${angle.toFixed(4)} 32 26)`}>
          <line
            x1={(32 - len / 2).toFixed(4)}
            y1="26"
            x2={(32 + len / 2).toFixed(4)}
            y2="26"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d={`M ${(29 + len / 2).toFixed(4)} 22 L ${(36 + len / 2).toFixed(4)} 26 L ${(29 + len / 2).toFixed(4)} 30 Z`}
            fill="currentColor"
          />
        </g>
      )}
    </svg>
  );
}
const examples = [
  {
    title: "High magnitude & high coherence",
    a: 1,
    lag: 0.9,
    context: 0.9,
    note: "Strong signal survives",
  },
  {
    title: "Low lag coherence",
    a: 1,
    lag: 0.2,
    context: 0.9,
    note: "Cancels across token positions",
  },
  {
    title: "Low context coherence",
    a: 1,
    lag: 0.9,
    context: 0.2,
    note: "Cancels across contexts",
  },
  {
    title: "Low magnitude",
    a: 0.2,
    lag: 0.9,
    context: 0.9,
    note: "Small magnitude limits the response",
  },
];
export function AveragingExplorer() {
  const [a, setA] = useState(1);
  const [lag, setLag] = useState(0.3);
  const [context, setContext] = useState(0.3);
  const [heat, setHeat] = useState(false);
  const responses = buildResponses(a, lag, context),
    result = coherenceFactors(responses);
  return (
    <section className={s.section} aria-labelledby="averaging-heading">
      <header className={s.header}>
        <div>
          <h2 id="averaging-heading">
            Jacobian Averaging: What Survives and What Cancels?
          </h2>
          <p>
            큰 반응도 방향이 다르면 상쇄돼. 세 factor를 분리해서 평균 뒤에 남는
            신호를 살펴보자.
          </p>
        </div>
        <div className={s.identity}>
          <MathText text="$\|J_Hv\|=a(v)\,\rho_\tau(v)\,\rho_c(v)$" />
        </div>
      </header>
      <div className={s.layout}>
        <aside className={s.controls}>
          {[
            {
              name: "Magnitude",
              symbol: "a(v)",
              value: a,
              set: setA,
              description: "개별 반응의 크기",
            },
            {
              name: "Lag coherence",
              symbol: "ρτ(v)",
              value: lag,
              set: setLag,
              description: "같은 context 안에서 방향의 일관성",
            },
            {
              name: "Context coherence",
              symbol: "ρc(v)",
              value: context,
              set: setContext,
              description: "context 사이 평균 반응의 일관성",
            },
          ].map((x, i) => (
            <label key={x.name}>
              <span>
                <b>{i + 1}</b>
                {x.name} <i>{x.symbol}</i>
              </span>
              <small>{x.description}</small>
              <div>
                <input
                  aria-label={x.name}
                  type="range"
                  min="0"
                  max="1"
                  step=".01"
                  value={x.value}
                  onChange={(e) => x.set(+e.target.value)}
                />
                <output>{x.value.toFixed(2)}</output>
              </div>
            </label>
          ))}
          <div className={s.view}>
            <span>View options</span>
            <div>
              <button aria-pressed={!heat} onClick={() => setHeat(false)}>
                Arrow view
              </button>
              <button aria-pressed={heat} onClick={() => setHeat(true)}>
                Heatmap view
              </button>
            </div>
          </div>
        </aside>
        <div className={s.responses}>
          <h3>
            Jacobian responses <span>K(c, ℓ, τ)v</span>
          </h3>
          <p>
            Context × token position ·{" "}
            {heat ? "입력 방향 축에 투영한 부호와 크기" : "2D output direction"}
          </p>
          <div className={s.scroll}>
            <div className={s.grid}>
              {responses.map((row, c) => (
                <div className={s.row} key={c}>
                  <strong>C{c + 1}</strong>
                  {row.map((v, t) => (
                    <div
                      key={t}
                      className={s.cell}
                      style={
                        heat
                          ? {
                              background: `rgba(${v[0] < 0 ? "156,15,52" : "35,77,130"},${(0.04 + 0.65 * Math.abs(v[0])).toFixed(4)})`,
                            }
                          : undefined
                      }
                      title={`C${c + 1}, τ=${t}: (${v[0].toFixed(3)}, ${v[1].toFixed(3)})`}
                    >
                      {heat ? <span>{v[0].toFixed(2)}</span> : <Vector v={v} />}
                    </div>
                  ))}
                </div>
              ))}
              <div className={s.row}>
                <span />
                {Array.from({ length: 8 }, (_, i) => (
                  <span key={i} className={s.tick}>
                    {i}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className={s.axis}>Token position τ</div>
          <p className={s.modelNote}>
            대칭적인 방향 배열을 사용해 세 factor를 독립적으로 조절해.
          </p>
        </div>
        <aside className={s.steps}>
          <h3>Averaging step by step</h3>
          <div className={s.step}>
            <h4>1　Lag averaging</h4>
            <p>각 context 안에서 token 위치를 평균</p>
            <div className={s.meanRows}>
              {result.rowMeans.map((v, i) => (
                <div key={i}>
                  <span>C{i + 1}</span>
                  <Vector v={v} />
                  <small>{Math.hypot(...v).toFixed(2)}</small>
                </div>
              ))}
            </div>
            <strong>평균 크기 = {(a * lag).toFixed(3)}</strong>
          </div>
          <div className={s.step}>
            <h4>2　Context averaging</h4>
            <p>context별 반응을 다시 평균</p>
            <div className={s.finalVector}>
              <Vector v={result.finalVector} />
              <strong>{result.finalMagnitude.toFixed(3)}</strong>
            </div>
          </div>
          <div className={s.final}>
            <h4>Final J-lens response</h4>
            <span>a(v) × ρτ(v) × ρc(v)</span>
            <p>
              {a.toFixed(2)} × {lag.toFixed(2)} × {context.toFixed(2)} ={" "}
              <b>{result.finalMagnitude.toFixed(3)}</b>
            </p>
          </div>
        </aside>
      </div>
      <div className={s.examples}>
        <h3>Example cases</h3>
        <div>
          {examples.map((x, i) => (
            <button
              key={x.title}
              onClick={() => {
                setA(x.a);
                setLag(x.lag);
                setContext(x.context);
              }}
            >
              <h4>
                <b>{String.fromCharCode(65 + i)}</b>
                {x.title}
              </h4>
              <p>
                a = {x.a.toFixed(1)}　ρτ = {x.lag.toFixed(1)}　ρc ={" "}
                {x.context.toFixed(1)}
              </p>
              <div className={s.exampleVisual}>
                <div>
                  {buildResponses(x.a, x.lag, x.context).map((row, c) => (
                    <div key={c}>
                      {row.slice(0, 4).map((v, t) => (
                        <Vector key={t} v={v} />
                      ))}
                    </div>
                  ))}
                </div>
                <strong>{(x.a * x.lag * x.context).toFixed(2)}</strong>
              </div>
              <small>{x.note}</small>
            </button>
          ))}
        </div>
      </div>
      <p className={s.note}>
        독립적으로 조절 가능한 대칭 벡터 배열을 사용한 개념 데모야. 각 셀은
        동일한 v에 대한 K(c, ℓ, τ)v이며, 수치는 벡터 평균에서 직접 계산해. a =
        0에서는 두 coherence를 0으로 정의하고, lag coherence = 0이면 context
        coherence도 0으로 정의해.
      </p>
    </section>
  );
}
