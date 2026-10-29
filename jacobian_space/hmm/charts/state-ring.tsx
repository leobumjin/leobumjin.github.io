import { useId } from "react";
import { svgCoordinate as fixed } from "../../shared/numeric";
import s from "../hmm.module.css";
function position(x: number, n: number) {
  const a = (2 * Math.PI * x) / n - Math.PI / 2;
  return {
    x: fixed(150 + 105 * Math.cos(a)),
    y: fixed(150 + 105 * Math.sin(a)),
  };
}
export function StateRing({
  n,
  state,
  probabilities,
  previous,
  drift,
  noise,
  reset,
  label = "posterior",
}: {
  n: number;
  state?: number;
  probabilities?: number[];
  previous?: number;
  drift?: number;
  noise?: number | null;
  reset?: boolean;
  label?: string;
}) {
  const id = useId().replaceAll(":", "");
  const p = previous === undefined ? null : position(previous, n),
    to = state === undefined ? null : position(state, n);
  const driftTo =
    previous === undefined ? null : position((previous + (drift ?? 0)) % n, n);
  return (
    <svg
      className={s.ring}
      viewBox="0 0 300 300"
      role="img"
      aria-label={
        probabilities
          ? `${label}: ${probabilities.map((p, i) => `${i}: ${p.toFixed(3)}`).join(", ")}`
          : `실제 상태 ${state}`
      }
    >
      <defs>
        <marker
          id={id}
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="5"
          markerHeight="5"
          orient="auto"
        >
          <path d="M0 0 10 5 0 10Z" fill="currentColor" />
        </marker>
      </defs>
      <circle
        cx="150"
        cy="150"
        r="105"
        fill="none"
        stroke="#d8e2ee"
        strokeWidth="1.5"
      />
      {p &&
        to &&
        (reset ? (
          <path
            d={`M${p.x} ${p.y} Q150 150 ${to.x} ${to.y}`}
            fill="none"
            stroke="#a3123b"
            strokeDasharray="5 4"
            markerEnd={`url(#${id})`}
            color="#a3123b"
          />
        ) : (
          <>
            {driftTo && (
              <path
                d={`M${p.x} ${p.y} Q150 150 ${driftTo.x} ${driftTo.y}`}
                fill="none"
                stroke="#345e8e"
                strokeWidth="1.6"
                markerEnd={`url(#${id})`}
                color="#345e8e"
              />
            )}
            {!!noise && driftTo && (
              <path
                d={`M${driftTo.x} ${driftTo.y} Q150 150 ${to.x} ${to.y}`}
                fill="none"
                stroke="#a3123b"
                strokeDasharray="4 3"
                markerEnd={`url(#${id})`}
                color="#a3123b"
              />
            )}
          </>
        ))}
      {Array.from({ length: n }, (_, i) => {
        const pos = position(i, n),
          prob = probabilities?.[i] ?? 0;
        const active = i === state;
        return (
          <g key={i}>
            <title>
              {probabilities
                ? `P(X=${i})=${prob.toFixed(4)}`
                : `State ${i}${active ? " · current" : ""}`}
            </title>
            <circle
              {...{ cx: pos.x, cy: pos.y }}
              r={n > 12 ? 12 : 16}
              fill={
                probabilities
                  ? `rgba(29,76,128,${(0.04 + 0.96 * prob).toFixed(4)})`
                  : active
                    ? "#941036"
                    : "#fff"
              }
              stroke={
                probabilities
                  ? "#9bb6d4"
                  : active
                    ? "#941036"
                    : i === previous
                      ? "#be9c57"
                      : "#193b68"
              }
              strokeWidth={i === previous && !probabilities ? 3 : 1.4}
            />
            <text
              x={pos.x}
              y={pos.y + 4}
              textAnchor="middle"
              fontSize={n > 12 ? 11 : 13}
              fill={active || prob > 0.55 ? "#fff" : "#10284c"}
            >
              {i}
            </text>
          </g>
        );
      })}
      <text x="150" y="145" textAnchor="middle" fill="#647c9b" fontSize="11">
        {probabilities ? label : "ground truth"}
      </text>
      <text
        x="150"
        y="171"
        textAnchor="middle"
        fill={probabilities ? "#214a7a" : "#941036"}
        fontSize="24"
      >
        {probabilities
          ? `Σp = ${probabilities.reduce((a, b) => a + b, 0).toFixed(2)}`
          : `X = ${state}`}
      </text>
    </svg>
  );
}
