"use client";
import { useMemo, useState } from "react";
import {
  averageJacobians,
  readGraphLens,
  runGraphTransformer,
  IDENTITY_MATRIX,
} from "../toy-transformer";

export function useGraphExplorer() {
  const [source, setSource] = useState(1);
  const [layer, setLayer] = useState(2);
  const [focus, setFocus] = useState(4);
  const [targets, setTargets] = useState([4]);
  const [showAllEdges, setShowAllEdges] = useState(false);
  const [view, setView] = useState<"matrix" | "lens">("lens");
  const [mode, setMode] = useState<"delta" | "hidden">("hidden");
  const [route, setRoute] = useState<"jacobian" | "direct">("jacobian");
  const [direction, setDirection] = useState(0);
  const [delta, setDelta] = useState(0.2);
  const levels = useMemo(() => runGraphTransformer(source), [source]);
  const matrix = levels[layer].jacobians[focus];
  const mean = averageJacobians(targets.map((t) => levels[layer].jacobians[t]));
  const scale = Math.max(
    1e-8,
    ...matrix.flat().map(Math.abs),
    ...(mean?.flat().map(Math.abs) ?? []),
  );
  const input =
    mode === "hidden"
      ? levels[0].values[source]
      : [0, 1, 2, 3].map((i) => (i === direction ? delta : 0));
  const jacobianReadout = mean
    ? readGraphLens(mean, input, mode === "hidden")
    : null;
  const identity = IDENTITY_MATRIX;
  const direct = mode === "hidden" && route === "direct";
  const directReadout = readGraphLens(identity, input, mode === "hidden");
  const readout = direct ? directReadout : jacobianReadout;
  const shownMatrix = direct ? identity : mean;
  const selectRoute = (value: "jacobian" | "direct") => {
    setRoute(value);
    setView("lens");
  };
  const maxLogit = Math.max(1e-8, ...(readout?.logits.map(Math.abs) ?? []));
  const maxTarget = Math.max(-1, ...targets);
  function pickOutput(row: number, t: number) {
    setFocus(t);
    if (row !== layer) {
      setLayer(row);
      setTargets([t]);
    } else
      setTargets((old) =>
        old.includes(t)
          ? old.filter((x) => x !== t)
          : [...old, t].sort((a, b) => a - b),
      );
  }

  return {
    source,
    setSource,
    layer,
    focus,
    targets,
    setTargets,
    showAllEdges,
    setShowAllEdges,
    view,
    setView,
    mode,
    setMode,
    route,
    direction,
    setDirection,
    delta,
    setDelta,
    levels,
    matrix,
    mean,
    scale,
    input,
    jacobianReadout,
    direct,
    readout,
    shownMatrix,
    selectRoute,
    maxLogit,
    maxTarget,
    pickOutput,
  };
}
export type GraphExplorer = ReturnType<typeof useGraphExplorer>;
