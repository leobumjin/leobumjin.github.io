"use client";
import { useId } from "react";
import { TOKENS } from "../toy-transformer";
import { LAYER_NAMES, tokenX, layerY } from "./geometry";
import type { GraphExplorer } from "./use-graph-explorer";
import s from "./explorer.module.css";

export function GraphCanvas({ explorer }: { explorer: GraphExplorer }) {
  const {
    source,
    setSource,
    layer,
    focus,
    targets,
    setTargets,
    showAllEdges,
    setShowAllEdges,
    mode,
    levels,
    input,
    jacobianReadout,
    direct,
    readout,
    selectRoute,
    setView,
    maxTarget,
    pickOutput,
  } = explorer;
  const arrowId = `graph-arrow-${useId().replaceAll(":", "")}`;
  return (
    <div className={s.graphScroller}>
      <div className={s.graphWorkspace}>
        <div className={s.graphInstructions}>
          <strong>계산 그래프</strong>
          <label>
            <input
              type="checkbox"
              checked={showAllEdges}
              onChange={(e) => setShowAllEdges(e.target.checked)}
            />
            모든 연결 보기
          </label>
        </div>
        <div className={s.graphCanvas}>
          <svg
            className={s.graphEdges}
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            role="img"
            aria-label="아래에서 위로 흐르는 causal Transformer 계산 그래프. 가로축은 token 위치."
          >
            <defs>
              <marker
                id={arrowId}
                viewBox="0 0 10 10"
                refX="8"
                refY="5"
                markerWidth="3"
                markerHeight="3"
                orient="auto-start-reverse"
              >
                <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" />
              </marker>
            </defs>
            {[0, 1].flatMap((row) =>
              TOKENS.flatMap((_, from) =>
                TOKENS.map((__, to) => {
                  if (from > to) return null;
                  const active =
                    row < layer &&
                    maxTarget >= source &&
                    from >= source &&
                    to <= maxTarget;
                  if (!active && !showAllEdges) return null;
                  return (
                    <path
                      key={`${row}-${from}-${to}`}
                      d={`M ${tokenX(from)} ${layerY(row) - 4} C ${tokenX(from)} ${layerY(row) - 9}, ${tokenX(to)} ${layerY(row + 1) + 9}, ${tokenX(to)} ${layerY(row + 1) + 4}`}
                      className={active ? s.activeEdge : s.inactiveEdge}
                      markerEnd={`url(#${arrowId})`}
                    />
                  );
                }),
              ),
            )}
            <path
              d={`M ${tokenX(source)} 85 C ${tokenX(source)} 82, 3 85, 3 79 L 3 43 Q 3 40 7 40`}
              className={s.hiddenReadEdge}
              markerEnd={`url(#${arrowId})`}
            />
            <path
              d="M 29 40 L 54 40"
              className={s.hiddenReadEdge}
              markerEnd={`url(#${arrowId})`}
            />
            {targets.map((t) => (
              <path
                key={`pool-${t}`}
                d={`M ${tokenX(t)} ${layerY(layer) - 4} C ${tokenX(t)} ${layerY(layer) - 8}, 68 48, 68 44`}
                className={s.lensEdge}
                markerEnd={`url(#${arrowId})`}
              />
            ))}
            {mode === "hidden" && (
              <path
                d="M 18 36 Q 18 28 30 28 L 38 28"
                className={`${s.directLensEdge} ${direct ? s.chosenRoute : s.quietRoute}`}
                markerEnd={`url(#${arrowId})`}
              />
            )}
            <path
              d="M 68 36 Q 68 28 62 28"
              className={`${s.lensEdge} ${!direct ? s.chosenRoute : s.quietRoute}`}
              markerEnd={`url(#${arrowId})`}
            />
            <path
              d="M 50 24 L 50 22 M 50 14 L 50 12"
              className={readout ? s.hiddenReadEdge : s.inactiveEdge}
              markerEnd={`url(#${arrowId})`}
            />
            {mode === "hidden" && (
              <path
                d="M 62 8 L 70 8"
                className={readout ? s.hiddenReadEdge : s.inactiveEdge}
                markerEnd={`url(#${arrowId})`}
              />
            )}
          </svg>
          <button
            className={`${s.decoderNode} ${s.liftedHiddenNode}`}
            style={{ left: "18%", top: "40%" }}
            onClick={() => selectRoute("direct")}
            aria-label={`입력 token ${source}의 hidden을 Logit Lens로 직접 읽기`}
            title={input.map((v) => v.toFixed(3)).join(", ")}
          >
            <span>
              {mode === "hidden" ? (
                <>
                  h<sub>0,{source}</sub>
                </>
              ) : (
                "δh"
              )}
              <small> · ℝ⁴</small>
            </span>
            <small>{input.map((v) => v.toFixed(2)).join("  ")}</small>
          </button>
          <button
            className={`${s.decoderNode} ${s.poolNode}`}
            style={{ left: "68%", top: "40%" }}
            onClick={() => selectRoute("jacobian")}
            disabled={!jacobianReadout}
            title={
              jacobianReadout?.response.map((v) => v.toFixed(3)).join(", ") ??
              "출력 hidden을 선택해 줘"
            }
          >
            <span>{mode === "delta" ? "Gₛ δh" : "Gₛ h"}</span>
            <small>출력 위치 평균 · 4D</small>
          </button>
          {mode === "hidden" && (
            <button
              className={`${s.routeLabel} ${s.directRouteLabel}`}
              style={{ left: "17%", top: "21%" }}
              aria-pressed={direct}
              onClick={() => selectRoute("direct")}
            >
              Logit Lens
            </button>
          )}
          <button
            className={s.routeLabel}
            style={{ left: "75%", top: "28%" }}
            aria-pressed={!direct}
            onClick={() => selectRoute("jacobian")}
          >
            J-lens
          </button>
          <button
            className={s.decoderNode}
            style={{ left: "50%", top: "28%" }}
            onClick={() => setView("lens")}
            disabled={!readout}
          >
            <span>{mode === "hidden" ? "norm" : "identity"}</span>
            <small>
              {mode === "hidden" ? "공통 L2 · 4D" : "δh 모드: norm 생략"}
            </small>
          </button>
          <button
            className={`${s.decoderNode} ${s.unembeddingNode}`}
            style={{ left: "50%", top: "18%" }}
            onClick={() => setView("lens")}
            disabled={!readout}
          >
            <span>
              W<sub>U</sub>
            </span>
            <small>공통 unembedding · 6 × 4</small>
          </button>
          <button
            className={`${s.decoderNode} ${s.logitsNode}`}
            style={{ left: "50%", top: "8%" }}
            onClick={() => setView("lens")}
            disabled={!readout}
            title={readout?.logits
              .map((v, i) => `${TOKENS[i]}: ${v.toFixed(3)}`)
              .join(" / ")}
          >
            <span>{mode === "delta" ? "Δlogits" : "logits"}</span>
            <small>{direct ? "Logit Lens" : "J-lens"} · 6D</small>
          </button>
          {mode === "hidden" && (
            <button
              className={`${s.decoderNode} ${s.softmaxNode}`}
              style={{ left: "83%", top: "8%" }}
              onClick={() => setView("lens")}
              disabled={!readout}
            >
              <span>softmax → p</span>
              <small>
                {readout
                  ? `${TOKENS[readout.probabilities.indexOf(Math.max(...readout.probabilities))]} · ${(Math.max(...readout.probabilities) * 100).toFixed(1)}%`
                  : "출력을 선택해 줘"}
              </small>
            </button>
          )}
          {LAYER_NAMES.map((name, row) => (
            <span
              key={name}
              className={s.graphLayerName}
              style={{ top: `${layerY(row) - 7}%` }}
            >
              {name}
            </span>
          ))}
          {levels.map((level, row) =>
            level.values.map((values, t) => {
              const selected =
                row === 0 ? t === source : row === layer && targets.includes(t);
              return (
                <button
                  key={`${row}-${t}`}
                  className={`${s.hiddenNode} ${selected ? s.selectedNode : ""} ${row === 0 ? s.inputNode : ""} ${row === layer && t === focus ? s.focusNode : ""}`}
                  style={{ left: `${tokenX(t)}%`, top: `${layerY(row)}%` }}
                  onClick={() =>
                    row === 0 ? setSource(t) : pickOutput(row, t)
                  }
                  aria-pressed={selected}
                  aria-label={`${LAYER_NAMES[row]}, token ${t} ${TOKENS[t]}, ${values.length}차원${row === 0 ? ", 입력 선택" : ", 평균에 추가 또는 제거"}`}
                >
                  <span>
                    h
                    <sub>
                      {row},{t}
                    </sub>
                    <small>ℝ⁴</small>
                  </span>
                  <span className={s.nodeValues}>
                    {values.map((v, i) => (
                      <i
                        key={i}
                        title={`dim ${i + 1}: ${v.toFixed(3)}`}
                        style={{
                          background: v < 0 ? "#9c183d" : "#28568d",
                          opacity: (
                            0.4 +
                            0.6 * Math.min(1, Math.abs(v))
                          ).toFixed(4),
                        }}
                      />
                    ))}
                  </span>
                </button>
              );
            }),
          )}
          {TOKENS.map((token, t) => (
            <span
              key={t}
              className={s.graphToken}
              style={{ left: `${tokenX(t)}%` }}
            >
              {token}
              <small>t = {t}</small>
            </span>
          ))}
        </div>
        <div className={s.graphLegend}>
          <span>블루 · Transformer</span>
          <span>버건디 · J-lens</span>
          <span>버건디 선 · Logit Lens</span>
          <span>연결선 · causal dependency</span>
          <span>모든 hidden · 4D</span>
        </div>
        <div className={s.averageControls}>
          <span>평균에 포함할 출력</span>
          <button
            onClick={() =>
              setTargets(TOKENS.map((_, i) => i).filter((i) => i >= source))
            }
          >
            현재 이후 전체
          </button>
          <button onClick={() => setTargets([])}>선택 비우기</button>
        </div>
        <p className={s.graphHint}>
          {focus < source
            ? "선택한 출력은 입력보다 과거에 있어 Jacobian이 0이다."
            : `아래 token ${source}를 고정하고 위 token을 더해 보자. 같은 출력 layer의 Jacobian을 원소별로 평균한다.`}
        </p>
      </div>
    </div>
  );
}
