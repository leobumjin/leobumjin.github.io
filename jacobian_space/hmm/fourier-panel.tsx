"use client";
import { MathText } from "../shared/math-text";
import { FourierChart } from "./charts/fourier-chart";
import type { Frame, Parameters } from "./model";
import s from "./hmm.module.css";

type FourierPanelProps = {
  frames: Frame[];
  frame: Frame;
  parameters: Parameters;
  mode: number;
  onModeChange: (mode: number) => void;
  predictionStep: boolean;
  onPredictionStepChange: (show: boolean) => void;
};
export function FourierPanel({
  frames,
  frame,
  parameters: p,
  mode,
  onModeChange,
  predictionStep,
  onPredictionStepChange,
}: FourierPanelProps) {
  const diffusion =
    1 - 2 * p.q + 2 * p.q * Math.cos((2 * Math.PI * mode) / p.n);
  const theta = (2 * Math.PI * mode * p.v) / p.n;
  return (
    <section className={s.panel}>
      <h2>
        <i />
        Fourier representation <small>mₜ⁽ʲ⁾</small>
      </h2>
      <div className={s.fourierControls}>
        <label>
          Mode j
          <select value={mode} onChange={(e) => onModeChange(+e.target.value)}>
            {Array.from({ length: p.n - 1 }, (_, i) => (
              <option value={i + 1} key={i}>
                {i + 1}
              </option>
            ))}
          </select>
        </label>
        <label className={s.check}>
          <input
            type="checkbox"
            checked={predictionStep}
            onChange={(e) => onPredictionStepChange(e.target.checked)}
          />
          Show prediction step
        </label>
      </div>
      <FourierChart
        frames={frames}
        frame={frame}
        j={mode}
        predictionStep={predictionStep}
      />
      <p className={s.hint}>
        블루: predictive mₜ · 버건디: posterior moment (예측 전)
      </p>
      <p className={s.alpha}>
        cⱼ = {diffusion.toFixed(3)} · |αⱼ| ={" "}
        {Math.abs(p.persistence * diffusion).toFixed(3)} · θⱼ ={" "}
        {((theta * 180) / Math.PI).toFixed(1)}°
      </p>
      {predictionStep && (
        <MathText
          text={String.raw`$m_t^{(j)}=\underbrace{\lambda c_j e^{i\theta_j}}_{\alpha_j}\,\underbrace{[(1-B_t)m_{t-1}^{(j)}+B_t\phi_j(X_t)]}_{\text{observation update}}$`}
        />
      )}
      <p className={s.hint}>
        mₜ = E[φⱼ(Xₜ₊₁) | Y₀:ₜ] · posterior는 Xₜ의 분포야. cⱼ가 음수이면 α의
        위상에는 θⱼ에 180°가 더해져.
      </p>
    </section>
  );
}
