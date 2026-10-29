"use client";
import { useEffect, useReducer, useState } from "react";
import {
  DEFAULTS,
  initialize,
  simulationReducer,
  type Parameters,
} from "./model";

export function useHMMSimulation() {
  const [sim, dispatch] = useReducer(simulationReducer, DEFAULTS, initialize);
  const [speed, setSpeed] = useState(500);
  const [pauseOnReveal, setPauseOnReveal] = useState(false);
  const [randomDraws, setRandomDraws] = useState(false);
  useEffect(() => {
    if (!sim.playing) return;
    const timer = setInterval(
      () => dispatch({ type: "step", pauseOnReveal }),
      speed,
    );
    return () => clearInterval(timer);
  }, [sim.playing, speed, pauseOnReveal]);
  function configure(update: Partial<Parameters>) {
    dispatch({
      type: "configure",
      parameters: { ...sim.parameters, ...update },
    });
  }
  return {
    sim,
    dispatch,
    speed,
    setSpeed,
    pauseOnReveal,
    setPauseOnReveal,
    randomDraws,
    setRandomDraws,
    configure,
  };
}
export type HMMController = ReturnType<typeof useHMMSimulation>;
