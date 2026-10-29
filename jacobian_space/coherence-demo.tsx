"use client";
import { useState } from "react";
import {
  coherenceFactors,
  responseFromAngle,
  type ResponseVector,
} from "./coherence";
import s from "./coherence-demo.module.css";
const presets = {
  aligned: {
    label: "모두 정렬",
    angles: Array.from({ length: 3 }, () => Array(6).fill(0) as number[]),
  },
  lag: {
    label: "Lag에서 상쇄",
    angles: Array.from({ length: 3 }, () => [0, 180, 0, 180, 0, 180]),
  },
  context: {
    label: "Context에서 상쇄",
    angles: [
      Array(6).fill(0),
      Array(6).fill(120),
      Array(6).fill(240),
    ] as number[][],
  },
  mixed: {
    label: "일부만 정렬",
    angles: [
      [0, 0, 0, 0, 0, 0],
      [90, 90, 90, 90, 90, 90],
      [0, 180, 0, 180, 0, 180],
    ],
  },
};
function Arrow({ vector, label }: { vector: ResponseVector; label: string }) {
  const size = Math.hypot(...vector);
  const angle = (-Math.atan2(vector[1], vector[0]) * 180) / Math.PI;
  return (
    <svg viewBox="0 0 70 46" role="img" aria-label={label} className={s.arrow}>
      <line x1="9" y1="23" x2="61" y2="23" className={s.axis} />
      {size < 1e-10 ? (
        <circle cx="35" cy="23" r="2" fill="currentColor" />
      ) : (
        <g transform={`rotate(${angle.toFixed(3)} 35 23)`}>
          <line
            x1="17"
            y1="23"
            x2="50"
            y2="23"
            stroke="currentColor"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <path d="M 47 17 L 56 23 L 47 29 Z" fill="currentColor" />
        </g>
      )}
    </svg>
  );
}
export function CoherenceDemo() {
  const [angles, setAngles] = useState<number[][]>(presets.mixed.angles);
  const [magnitude, setMagnitude] = useState(0.9);
  const responses = angles.map((row) =>
    row.map((angle) => responseFromAngle(angle, magnitude)),
  );
  const factors = coherenceFactors(responses);
  const fmt = (n: number) => (Math.abs(n) < 1e-10 ? "0.000" : n.toFixed(3));
  return (
    <section className={s.section} aria-labelledby="coherence-title">
      <header className={s.header}>
        <div>
          <span>AVERAGING / COHERENCE</span>
          <h2 id="coherence-title">방향이 다르면, 평균에서 무엇이 남을까?</h2>
          <p>
            같은 입력 방향 v에 대한 반응 K(c, τ)v를 비교해. 셀을 누르면 반응
            방향이 45°씩 바뀌어.
          </p>
        </div>
        <label>
          반응 크기 a = {magnitude.toFixed(2)}
          <input
            type="range"
            min="0"
            max="1.5"
            step=".05"
            value={magnitude}
            onChange={(e) => setMagnitude(+e.target.value)}
          />
        </label>
      </header>
      <div className={s.presets} aria-label="방향 배치 예시">
        {Object.entries(presets).map(([key, preset]) => (
          <button
            key={key}
            onClick={() => setAngles(preset.angles)}
            aria-pressed={
              JSON.stringify(angles) === JSON.stringify(preset.angles)
            }
          >
            {preset.label}
          </button>
        ))}
      </div>
      <div className={s.workspace}>
        <div className={s.gridScroll}>
          <div className={s.grid}>
            <div className={s.corner}>Context / lag</div>
            {Array.from({ length: 6 }, (_, t) => (
              <div key={t} className={s.column}>
                τ = {t}
              </div>
            ))}
            <div className={s.column}>Lag 평균</div>
            {responses.map((row, c) => (
              <div className={s.row} key={c}>
                <div className={s.rowLabel}>C{c + 1}</div>
                {row.map((v, t) => (
                  <button
                    key={t}
                    className={`${s.cell} ${v[0] < -1e-10 ? s.reverse : ""}`}
                    onClick={() =>
                      setAngles((old) =>
                        old.map((r, i) =>
                          i === c
                            ? r.map((a, j) => (j === t ? (a + 45) % 360 : a))
                            : r,
                        ),
                      )
                    }
                    aria-label={`Context ${c + 1}, lag ${t}, 방향 ${angles[c][t]}도. 클릭해 45도 회전`}
                  >
                    <Arrow vector={v} label={`${angles[c][t]}° 방향`} />
                    <small>{angles[c][t]}°</small>
                  </button>
                ))}
                <div className={s.rowMean}>
                  <Arrow
                    vector={factors.rowMeans[c]}
                    label={`Context ${c + 1}의 lag 평균`}
                  />
                  <span>
                    ‖G{c + 1}v‖ = {fmt(Math.hypot(...factors.rowMeans[c]))}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <aside className={s.result} aria-live="polite">
          <span className={s.resultLabel}>Context 평균 · Jv</span>
          <Arrow vector={factors.finalVector} label="전체 평균 반응 방향" />
          <strong>{fmt(factors.finalMagnitude)}</strong>
          <p>
            ({fmt(factors.finalVector[0])}, {fmt(factors.finalVector[1])})
          </p>
          <span>
            고정한 입력 방향 v에 대한
            <br />
            평균 Jacobian의 반응 크기
          </span>
        </aside>
      </div>
      <div className={s.factors}>
        {[
          {
            name: "Magnitude",
            symbol: "a(v)",
            value: factors.magnitude,
            description: "평균하기 전 개별 반응의 크기",
          },
          {
            name: "Lag coherence",
            symbol: "ρτ(v)",
            value: factors.lagCoherence,
            description: "token 위치를 평균한 뒤 남은 비율",
          },
          {
            name: "Context coherence",
            symbol: "ρc(v)",
            value: factors.contextCoherence,
            description: "context를 평균한 뒤 남은 비율",
          },
        ].map((factor) => (
          <div key={factor.name}>
            <span>
              {factor.name} <i>{factor.symbol}</i>
            </span>
            <strong>{fmt(factor.value)}</strong>
            <p>{factor.description}</p>
          </div>
        ))}
        <div className={s.product}>
          <span>최종 반응 ‖Jv‖ = a(v) ρτ(v) ρc(v)</span>
          <strong>
            {fmt(factors.magnitude)} × {fmt(factors.lagCoherence)} ×{" "}
            {fmt(factors.contextCoherence)} ={" "}
            <em>{fmt(factors.finalMagnitude)}</em>
          </strong>
        </div>
      </div>
      <p className={s.note}>
        각 셀은 Jacobian 행렬 자체가 아니라 K(c, τ)v라는 2차원 출력 벡터야.
        Context와 lag를 균일하게 평균하며, 수치는 현재 배치에서 직접 계산해.
        반응 크기는 슬라이더와 숫자로, 화살표는 방향으로 표시해. 분모가 0인
        coherence는 0으로 정의해.
      </p>
    </section>
  );
}
