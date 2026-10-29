"use client";
import { MathText } from "../shared/math-text";
import { TOKENS, norm } from "../toy-transformer";
import { JacobianMatrix } from "./jacobian-matrix";
import type { GraphExplorer } from "./use-graph-explorer";
import s from "./explorer.module.css";

export function GraphReadout({ explorer }: { explorer: GraphExplorer }) {
  const {
    source,
    layer,
    focus,
    targets,
    view,
    setView,
    mode,
    setMode,
    direction,
    setDirection,
    delta,
    setDelta,
    matrix,
    mean,
    scale,
    input,
    direct,
    readout,
    shownMatrix,
    selectRoute,
    maxLogit,
  } = explorer;
  return (
    <div className={s.graphReadout}>
      <div className={s.readoutTabs}>
        <button aria-pressed={view === "lens"} onClick={() => setView("lens")}>
          Token 읽기
        </button>
        <button
          aria-pressed={view === "matrix"}
          onClick={() => setView("matrix")}
        >
          Jacobian 행렬
        </button>
      </div>
      {view === "matrix" ? (
        <>
          <section>
            <h2>
              개별 Jacobian{" "}
              <small>
                입력 {source} / 출력 {focus}
              </small>
            </h2>
            <MathText
              text={`$K=\\frac{\\partial h_{${layer},${focus}}}{\\partial h_{0,${source}}}\\in\\mathbb R^{4\\times4}$`}
            />
            <JacobianMatrix
              matrix={matrix}
              scale={scale}
              label="선택한 hidden 사이의 4×4 Jacobian"
            />
            <p className={s.matrixDetail}>
              행 = 출력 4차원 · 열 = 입력 4차원 · ‖K‖<sub>F</sub> ={" "}
              {norm(matrix.flat()).toFixed(3)}
            </p>
          </section>
          <section>
            <h2>
              출력 위치 평균{" "}
              <small>
                {targets.length} tokens · layer {layer}
              </small>
            </h2>
            <MathText text={`$G_S=\\frac{1}{|S|}\\sum_{u\\in S}K_u$`} />
            {mean ? (
              <JacobianMatrix
                matrix={mean}
                scale={scale}
                label="선택한 출력 token들의 평균 4×4 Jacobian"
              />
            ) : (
              <div className={s.emptyMatrix}>
                위 hidden을 선택해 평균을 만들어 봐.
              </div>
            )}
            <p className={s.matrixDetail}>
              S = {`{${targets.join(", ")}}`} · 두 행렬은 같은 색 척도
            </p>
          </section>
        </>
      ) : (
        <section className={s.lensPanel}>
          <MathText
            text={
              mode === "delta"
                ? "$\\Delta z=W_U G_S\\,\\delta h$"
                : direct
                  ? "$p=\\mathrm{softmax}(W_U\\,\\mathrm{norm}(h))$"
                  : "$p=\\mathrm{softmax}(W_U\\,\\mathrm{norm}(G_Sh))$"
            }
          />
          {mode === "hidden" && (
            <div className={s.routeSwitch}>
              <button
                aria-pressed={!direct}
                onClick={() => selectRoute("jacobian")}
              >
                J-lens · Gₛh
              </button>
              <button
                aria-pressed={direct}
                onClick={() => selectRoute("direct")}
              >
                Logit Lens · h
              </button>
            </div>
          )}
          <div className={s.lensInputControls}>
            {mode === "delta" ? (
              <>
                <label>
                  입력 방향{" "}
                  <select
                    value={direction}
                    onChange={(e) => setDirection(+e.target.value)}
                  >
                    {[0, 1, 2, 3].map((i) => (
                      <option key={i} value={i}>
                        e{i + 1}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  δ = {delta.toFixed(2)}
                  <input
                    aria-label="입력 변화량"
                    type="range"
                    min="-.8"
                    max=".8"
                    step=".01"
                    value={delta}
                    onChange={(e) => setDelta(+e.target.value)}
                  />
                </label>
              </>
            ) : (
              <span>현재 입력 token {source}의 hidden vector 사용</span>
            )}
          </div>
          <div className={s.lensFlow}>
            <div>
              <span>
                {direct ? (
                  "I · 4 × 4"
                ) : (
                  <>
                    G<sub>S</sub> · 4 × 4
                  </>
                )}
              </span>
              {shownMatrix ? (
                <div className={s.miniMatrix}>
                  {shownMatrix.flat().map((v, i) => (
                    <span key={i}>{v.toFixed(2)}</span>
                  ))}
                </div>
              ) : (
                <p className={s.noSelection}>출력을 선택해 줘</p>
              )}
            </div>
            <span className={s.flowOperator}>×</span>
            <div>
              <span>{mode === "delta" ? "δh · 4D" : "h · 4D"}</span>
              <div className={s.cleanVector}>
                {input.map((v, i) => (
                  <span key={i}>{v.toFixed(2)}</span>
                ))}
              </div>
            </div>
            <span className={s.flowOperator}>=</span>
            <div>
              <span>
                {mode === "delta" ? "Δh · 4D" : direct ? "h · 4D" : "Gh · 4D"}
              </span>
              <div className={s.cleanVector}>
                {(readout?.response ?? [0, 0, 0, 0]).map((v, i) => (
                  <span key={i}>{readout ? v.toFixed(3) : "—"}</span>
                ))}
              </div>
            </div>
          </div>
          <div className={s.decodeStep}>
            {mode === "delta"
              ? "↓ Wᵤ · unembedding (6 × 4)"
              : "↓ L2 normalization → Wᵤ (6 × 4) → softmax"}
          </div>
          {readout ? (
            <div
              className={s.logitBars}
              aria-label={
                mode === "delta"
                  ? "각 token logit의 선형 변화"
                  : direct
                    ? "Logit Lens token 확률"
                    : "J-lens token 확률"
              }
            >
              {TOKENS.map((token, i) => {
                const v =
                  mode === "delta"
                    ? readout.logits[i]
                    : readout.probabilities[i];
                return (
                  <div key={i}>
                    <span>{token}</span>
                    <div className={s.logitTrack}>
                      {mode === "delta" && <i className={s.zeroLine} />}
                      <i
                        className={s.logitBar}
                        style={{
                          left:
                            mode === "delta"
                              ? (v < 0
                                  ? 50 - (50 * Math.abs(v)) / maxLogit
                                  : 50
                                ).toFixed(4) + "%"
                              : "0",
                          width:
                            (mode === "delta"
                              ? (50 * Math.abs(v)) / maxLogit
                              : 100 * v
                            ).toFixed(4) + "%",
                          background: v < 0 ? "#315b88" : "#a5133b",
                        }}
                      />
                    </div>
                    <b>
                      {mode === "delta"
                        ? (v >= 0 ? "+" : "") + v.toFixed(3)
                        : (v * 100).toFixed(1) + "%"}
                    </b>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className={s.emptyMatrix}>
              위 hidden을 선택하면 계산을 이어가.
            </div>
          )}
          <details className={s.advanced}>
            <summary>국소 변화 δh 살펴보기</summary>
            <div className={s.lensMode}>
              <button
                aria-pressed={mode === "hidden"}
                onClick={() => setMode("hidden")}
              >
                Hidden h 읽기
              </button>
              <button
                aria-pressed={mode === "delta"}
                onClick={() => setMode("delta")}
              >
                δh 개입
              </button>
            </div>
          </details>
          <p className={s.lensCaveat}>
            {mode === "delta"
              ? "Δz는 norm을 생략한 선형 logit 변화다. 확률이나 실제 next-token 예측은 아니다."
              : direct
                ? "Logit Lens는 G_S를 거치지 않고 같은 h를 공통 norm과 Wᵤ로 읽는다."
                : "논문은 context까지 평균한 J_H를 사용한다. 여기서는 한 context의 G_S와 L2 norm으로 그 읽기 과정을 보여준다."}{" "}
            고정 Wᵤ는 교육용이며 학습하지 않았다.
          </p>
        </section>
      )}
    </div>
  );
}
