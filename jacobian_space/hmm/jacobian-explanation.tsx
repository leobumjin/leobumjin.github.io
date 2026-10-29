import { MathText } from "../shared/math-text";
import s from "./jacobian-explanation.module.css";
const observations = [3, null, null, 2, null, null, 1, null, null, 7];
function MiniRing({
  state,
  trail,
  blue = false,
}: {
  state: number;
  trail?: number[];
  blue?: boolean;
}) {
  const activeSlot = state === 3 ? 6 : 2;
  const color = blue ? "#174775" : "#951035";
  return (
    <svg
      viewBox="0 0 180 150"
      role="img"
      aria-label={`설명용 ring · 공개 상태 ${state}`}
    >
      <circle cx="90" cy="73" r="52" fill="none" stroke="#b8c9df" />
      {Array.from({ length: 8 }, (_, i) => {
        const a = (i * Math.PI) / 4 - Math.PI / 2,
          x = +(90 + 52 * Math.cos(a)).toFixed(3),
          y = +(73 + 52 * Math.sin(a)).toFixed(3);
        const active = i === activeSlot;
        return (
          <g key={i}>
            <circle
              cx={x}
              cy={y}
              r={active ? 12 : 8}
              fill={
                active
                  ? color
                  : trail?.includes(i)
                    ? blue
                      ? "#a8bfd8"
                      : "#f2c4d0"
                    : "#fff"
              }
              stroke={active ? color : "#315780"}
            />
            {active && (
              <text
                x={x}
                y={y + 4}
                fill="#fff"
                fontSize="12"
                textAnchor="middle"
              >
                {state}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}
export default function JacobianExplanation() {
  return (
    <section className={s.section} aria-labelledby="propagation-title">
      <header>
        <h2 id="propagation-title">
          Why the Jacobian Propagates without New Information,
          <br />
          and Resets with New Observations
        </h2>
        <p>Bayes filter에서 과거 관측의 영향이 이어지거나 끊기는 이유</p>
      </header>
      <div className={s.sequenceSection}>
        <div className={s.panel}>
          <h3>
            <b>1</b>Observed sequence: information arrives intermittently
          </h3>
          <div className={s.scroll}>
            <table>
              <thead>
                <tr>
                  <th>t</th>
                  {observations.map((_, i) => (
                    <th key={i}>{i}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th>Observed Yₜ</th>
                  {observations.map((v, i) => (
                    <td key={i}>
                      <span className={v === null ? s.null : s.reveal}>
                        {v ?? "NULL"}
                      </span>
                    </td>
                  ))}
                </tr>
                <tr>
                  <th>Reveal Bₜ</th>
                  {observations.map((v, i) => (
                    <td key={i}>{+(v !== null)}</td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className={`${s.panel} ${s.legend}`}>
          <div>
            <strong>Observed token · Bₜ = 1</strong>
            <p>
              현재 상태를 완전히 공개해.
              <br />
              Posterior가 새 관측으로 교체돼.
            </p>
          </div>
          <div>
            <strong>NULL token · Bₜ = 0</strong>
            <p>
              새 상태 정보가 없어.
              <br />
              이전 belief와 전이 규칙에 의존해.
            </p>
          </div>
        </div>
      </div>
      <div className={s.panel}>
        <h3>
          <b>2</b>이전 관측에 대한 작은 변화는 어디까지 전달될까?
        </h3>
        <div className={s.stages}>
          {[
            {
              title: "관측 입력 · t = 0",
              subtitle: "새 정보가 들어옴",
              state: 3,
              trail: [5],
              text: "관측한 evidence의 Fourier moment가 현재 predictive belief에 직접 영향을 줘.",
              formula: String.raw`$\frac{\partial m_0^{(j)}}{\partial\phi_j(X_0)}=\alpha_j$`,
            },
            {
              title: "NULL · t = 1, 2",
              subtitle: "전파와 감쇠",
              state: 3,
              trail: [1, 2, 4],
              text: "새 관측이 없으므로 이전 정보의 영향이 이어져. 매 step마다 αⱼ를 곱해 크기와 위상이 바뀌어.",
              formula: String.raw`$\frac{\partial m_t^{(j)}}{\partial m_{t-1}^{(j)}}=\alpha_j$`,
            },
            {
              title: "새 관측 · t = 3",
              subtitle: "이전 영향이 끊김",
              state: 2,
              trail: [],
              text: "새 관측이 이전 belief를 교체해. t=0의 evidence에 대한 미분은 이 시점부터 0이야.",
              formula: String.raw`$\frac{\partial m_3^{(j)}}{\partial\phi_j(X_0)}=0$`,
            },
            {
              title: "NULL · t = 4, 5",
              subtitle: "새 정보가 다시 전파",
              state: 2,
              trail: [6],
              text: "t=3에서 들어온 새 정보는 다음 reveal까지 전파돼. t=0의 영향이 다시 살아나는 것은 아니야.",
              formula: String.raw`$\frac{\partial m_{3+\tau}^{(j)}}{\partial\phi_j(X_3)}=\alpha_j^{\tau+1}\quad(\tau=1,2)$`,
            },
            {
              title: "다음 관측 · t = 6",
              subtitle: "다시 교체",
              state: 1,
              trail: [1],
              text: "새로운 관측에서 또 다른 정보 전달이 시작돼. t=3의 evidence가 주던 영향은 0이 돼.",
              formula: String.raw`$\frac{\partial m_6^{(j)}}{\partial\phi_j(X_3)}=0$`,
            },
          ].map((stage, i) => (
            <article key={stage.title}>
              <span className={s.stageNumber}>
                {String.fromCharCode(97 + i)}
              </span>
              <h4>{stage.title}</h4>
              <small>{stage.subtitle}</small>
              <MiniRing
                state={stage.state}
                trail={stage.trail}
                blue={i === 2 || i === 3}
              />
              <p>{stage.text}</p>
              <MathText text={stage.formula} />
            </article>
          ))}
        </div>
        <p className={s.caption}>
          설명용 관측열과 개념도야. Ring의 옅은 점은 과거 정보의 전달을
          상징하며, 위 시뮬레이터의 실제 상태·확률분포와는 별개야.
        </p>
      </div>
      <div className={s.panel}>
        <h3>
          <b>3</b>Bayes filter update에서 Jacobian을 직접 계산하기
        </h3>
        <div className={s.derivation}>
          <div>
            <h4>Bayesian filter update · Eq. 16</h4>
            <MathText
              text={String.raw`$m_t^{(j)}=\alpha_j\big[(1-B_t)m_{t-1}^{(j)}+B_t\phi_j(X_t)\big]$`}
            />
            <h4>Local Jacobian</h4>
            <MathText
              text={String.raw`$\frac{\partial m_t^{(j)}}{\partial m_{t-1}^{(j)}}=\alpha_j(1-B_t)$`}
            />
            <p>
              <strong>NULL:</strong> Bₜ = 0 이면 αⱼ를 곱해 전달해.
            </p>
            <p>
              <strong>Reveal:</strong> Bₜ = 1 이면 이전 belief에 대한 미분이
              0이야.
            </p>
          </div>
          <div>
            <h4>관측한 source s에서 미래 belief로 · Eq. 18</h4>
            <p>Bₛ = 1인 source의 evidence에 대한 반응:</p>
            <MathText
              text={String.raw`$$\begin{aligned}K_j(s,\tau)&:=\frac{\partial m_{s+\tau}^{(j)}}{\partial\phi_j(X_s)}\\[6pt]&=\alpha_j^{\tau+1}\prod_{k=1}^{\tau}(1-B_{s+k})\end{aligned}$$`}
            />
            <MathText
              text={String.raw`$$\begin{aligned}\alpha_j&=\lambda c_j e^{i\theta_j}\\[5pt]c_j&=1-2q+2q\cos\!\frac{2\pi j}{n}\\[5pt]\theta_j&=\frac{2\pi jv}{n}\end{aligned}$$`}
            />
            <h4>αⱼ의 세 가지 요소</h4>
            <MathText
              text={String.raw`$$\boxed{\alpha_j=\underbrace{\lambda}_{\text{상태 지속성}}\qquad\underbrace{c_j}_{\text{이동 노이즈}}\qquad\underbrace{e^{i\theta_j}}_{\text{회전}}}$$`}
            />
            <p>
              <strong>
                αⱼ<sup>τ+1</sup>:
              </strong>{" "}
              크기를 감쇠시키고 위상을 회전시켜. τ=0에도 evidence에서 다음 상태
              belief로 전이하므로 αⱼ가 한 번 들어가.
            </p>
            <p>
              <strong>곱 항:</strong> 중간에 reveal이 한 번이라도 있으면 0이 돼.
              τ=0일 때 빈 곱은 1이야.
            </p>
            <small>
              source 위치는 s, lag는 τ로 표기해. 전체 context는 c=(x,s)이며, Eq.
              18의 Kⱼ(c,τ)와 같은 의미야.
            </small>
          </div>
          <div>
            <h4>감쇠 예시 · s = 0, |αⱼ| = 0.7</h4>
            <svg
              className={s.decay}
              viewBox="0 0 320 190"
              role="img"
              aria-label="lag 0, 1, 2에서 반응 크기 0.7, 0.49, 0.343. lag 3에서 reveal을 만나 0, 이후도 0."
            >
              <rect x="178" y="20" width="122" height="125" fill="#fff0f4" />
              <path d="M36 20V145H305" fill="none" stroke="#91a8c7" />
              {[0, 0.5, 1].map((v) => (
                <g key={v}>
                  <text x="5" y={149 - v * 120} fontSize="10" fill="#526b8c">
                    {v}
                  </text>
                  <path d={`M36 ${145 - v * 120}H305`} stroke="#e7edf5" />
                </g>
              ))}
              {[0, 1, 2, 3, 4, 5].map((t) => {
                const v = t < 3 ? 0.7 ** (t + 1) : 0;
                return (
                  <g key={t}>
                    <rect
                      x={48 + t * 43}
                      y={+(145 - 120 * v).toFixed(3)}
                      width="27"
                      height={+(120 * v).toFixed(3)}
                      fill="#3d648e"
                    />
                    <text
                      x={61 + t * 43}
                      y="164"
                      textAnchor="middle"
                      fontSize="11"
                      fill="#244773"
                    >
                      {t}
                    </text>
                  </g>
                );
              })}
              <text x="50" y="14" fontSize="11" fill="#345780">
                ‖Kⱼ(0,τ)‖
              </text>
              <text x="191" y="37" fontSize="11" fill="#9b1339">
                Reveal: B₃ = 1
              </text>
              <text x="303" y="180" fontSize="12" fill="#244773">
                τ
              </text>
            </svg>
            <div className={s.indicators}>
              <span>B₀₊τ</span>
              {[1, 0, 0, 1, 0, 0].map((v, i) => (
                <span key={i} className={v ? s.reveal : s.null}>
                  {v}
                </span>
              ))}
            </div>
            <p>
              source인 B₀ = 1은 입력 조건이야. 영향 차단은 그 뒤의 B₁, B₂, …가
              결정해.
            </p>
          </div>
        </div>
      </div>
      <div className={s.connection}>
        <strong>Transformer와의 연결</strong>
        <p>
          이 정확한 차단 구조는 완전한 reveal을 쓰는 Bayes filter의 성질이야.
          학습된 Transformer에서도 같은 표현과 정확한 0이 자동으로 보장되는 것은
          아니므로, 논문은 실제 Jacobian과 coherence를 별도로 측정해 비교해.
        </p>
      </div>
    </section>
  );
}
