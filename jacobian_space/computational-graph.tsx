"use client";
import { GraphCanvas } from "./graph/graph-canvas";
import { GraphReadout } from "./graph/graph-readout";
import { useGraphExplorer } from "./graph/use-graph-explorer";
import s from "./graph/explorer.module.css";

export function ComputationalGraph() {
  const explorer = useGraphExplorer();
  return (
    <div className={s.graphDemo}>
      <GraphCanvas explorer={explorer} />
      <GraphReadout explorer={explorer} />
    </div>
  );
}
