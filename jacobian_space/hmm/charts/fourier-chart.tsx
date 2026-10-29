import { moment, type Frame } from "../model";
import { svgCoordinate as fixed } from "../../shared/numeric";
import s from "../hmm.module.css";
export function FourierChart({
  frames,
  frame,
  j,
  predictionStep,
}: {
  frames: Frame[];
  frame: Frame;
  j: number;
  predictionStep: boolean;
}) {
  const posterior = moment(frame.posterior, j),
    predictive = moment(frame.prediction, j),
    start = frames.slice(-40);
  const path = (dimension: number) =>
    start
      .map(
        (f, i) =>
          `${i ? "L" : "M"}${fixed(30 + (start.length > 1 ? i / (start.length - 1) : 0) * 350)} ${fixed(80 - moment(f.prediction, j)[dimension] * 55)}`,
      )
      .join(" ");
  return (
    <div className={s.fourierCharts}>
      <svg
        viewBox="0 0 230 210"
        role="img"
        aria-label={`Predictive Fourier mode: Re ${predictive[0].toFixed(3)}, Im ${predictive[1].toFixed(3)}`}
      >
        <circle
          cx="110"
          cy="105"
          r="75"
          fill="none"
          stroke="#b5c6dd"
          strokeDasharray="4 4"
        />
        <path d="M15 105H205M110 15V195" stroke="#a0b3cc" />
        <text x="202" y="99">
          Re
        </text>
        <text x="116" y="18">
          Im
        </text>
        {predictionStep && (
          <line
            x1="110"
            y1="105"
            x2={fixed(110 + 75 * posterior[0])}
            y2={fixed(105 - 75 * posterior[1])}
            stroke="#b85a76"
            strokeWidth="3"
          />
        )}
        <line
          x1="110"
          y1="105"
          x2={fixed(110 + 75 * predictive[0])}
          y2={fixed(105 - 75 * predictive[1])}
          stroke="#1d4c80"
          strokeWidth="3"
        />
        <circle
          cx={fixed(110 + 75 * predictive[0])}
          cy={fixed(105 - 75 * predictive[1])}
          r="4"
          fill="#1d4c80"
        />
      </svg>
      <div>
        <div className={s.legend}>
          <span>버건디 Re(m)</span>
          <span>블루 Im(m)</span>
        </div>
        <svg
          viewBox="0 0 410 180"
          role="img"
          aria-label="선택 시점까지 최대 40 step의 predictive Fourier moment 시계열"
        >
          <path d="M30 20V140H385M30 80H385" stroke="#a5b7cf" fill="none" />
          {[-1, 0, 1].map((v) => (
            <text key={v} x="8" y={84 - v * 55}>
              {v}
            </text>
          ))}
          <path d={path(0)} stroke="#981238" strokeWidth="2" fill="none" />
          <path d={path(1)} stroke="#245b98" strokeWidth="2" fill="none" />
          {[0, Math.max(0, start.length - 1)].map((i, k) => (
            <text key={k} x={k ? 365 : 30} y="159">
              {start[i]?.t ?? 0}
            </text>
          ))}
          <text x="390" y="158">
            t
          </text>
        </svg>
        <p>
          m = {predictive[0].toFixed(3)} {predictive[1] < 0 ? "−" : "+"}{" "}
          {Math.abs(predictive[1]).toFixed(3)}i
        </p>
      </div>
    </div>
  );
}
