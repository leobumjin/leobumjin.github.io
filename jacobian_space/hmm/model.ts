export type Parameters = {
  n: number;
  v: number;
  q: number;
  persistence: number;
  reveal: number;
  seed: number;
};
export const MAX_STEPS = 500;

export const DEFAULTS: Parameters = {
  n: 8,
  v: 2,
  q: 0.15,
  persistence: 0.9,
  reveal: 0.2,
  seed: 42,
};
export type Frame = {
  t: number;
  state: number;
  revealed: boolean;
  forced: boolean;
  /** Current state distribution before observing Y_t. */
  prior: number[];
  /** Current state distribution after observing Y_t. */
  posterior: number[];
  /** Next-state distribution; this is the distribution used for m_t. */
  prediction: number[];
  rng: number;
  noise: number | null;
  reset: boolean;
  uniform: number | null;
  branchDraw: number | null;
  observationDraw: number;
};
export type Simulation = {
  parameters: Parameters;
  frames: Frame[];
  cursor: number;
  playing: boolean;
};
export type Action =
  | { type: "configure"; parameters: Parameters }
  | { type: "reset" }
  | { type: "play" }
  | { type: "pause" }
  | { type: "seek"; cursor: number }
  | { type: "step"; force?: boolean; pauseOnReveal?: boolean };
const mod = (x: number, n: number) => ((x % n) + n) % n;
/** Deterministic LCG: each frame retains the state needed for replay/branching. */
function draw(rng: number): [number, number] {
  const next = (Math.imul(rng, 1664525) + 1013904223) >>> 0;
  return [next / 4294967296, next];
}
export function predict(p: number[], config: Parameters) {
  const { n, v, q, persistence: l } = config;
  const next = Array(n).fill((1 - l) / n) as number[];
  for (let x = 0; x < n; x++)
    for (const [d, weight] of [
      [-1, q],
      [0, 1 - 2 * q],
      [1, q],
    ])
      next[mod(x + v + d, n)] += l * p[x] * weight;
  return next;
}
export function moment(p: number[], j: number): [number, number] {
  return p.reduce<[number, number]>(
    (sum, prob, x) => [
      sum[0] + prob * Math.cos((2 * Math.PI * j * x) / p.length),
      sum[1] + prob * Math.sin((2 * Math.PI * j * x) / p.length),
    ],
    [0, 0],
  );
}
export function tokenPrediction(frame: Frame, p: Parameters) {
  return [...frame.prediction.map((v) => v * p.reveal), 1 - p.reveal];
}
function observe(state: number, prior: number[], revealed: boolean) {
  return revealed ? prior.map((_, i) => +(i === state)) : [...prior];
}
export function initialize(parameters: Parameters = DEFAULTS): Simulation {
  let rng = parameters.seed >>> 0;
  let r;
  [r, rng] = draw(rng);
  const state = Math.floor(r * parameters.n);
  let observationDraw;
  [observationDraw, rng] = draw(rng);
  const prior = Array(parameters.n).fill(1 / parameters.n) as number[];
  const revealed = observationDraw < parameters.reveal;
  const posterior = observe(state, prior, revealed);
  return {
    parameters,
    frames: [
      {
        t: 0,
        state,
        prior,
        posterior,
        prediction: predict(posterior, parameters),
        revealed,
        forced: false,
        rng,
        noise: null,
        reset: false,
        uniform: null,
        branchDraw: null,
        observationDraw,
      },
    ],
    cursor: 0,
    playing: false,
  };
}
export function advance(
  previous: Frame,
  p: Parameters,
  force?: boolean,
): Frame {
  let rng = previous.rng;
  let branchDraw, noiseDraw, uniformDraw, observationDraw;
  [branchDraw, rng] = draw(rng);
  [noiseDraw, rng] = draw(rng);
  [uniformDraw, rng] = draw(rng);
  [observationDraw, rng] = draw(rng);
  const reset = branchDraw >= p.persistence;
  const d = noiseDraw < p.q ? -1 : noiseDraw < 1 - p.q ? 0 : 1;
  const uniform = Math.floor(uniformDraw * p.n);
  const state = reset ? uniform : mod(previous.state + p.v + d, p.n);
  const prior = [...previous.prediction];
  const revealed = force ?? observationDraw < p.reveal;
  const posterior = observe(state, prior, revealed);
  return {
    t: previous.t + 1,
    state,
    prior,
    posterior,
    prediction: predict(posterior, p),
    revealed,
    forced: force !== undefined,
    rng,
    noise: reset ? null : d,
    reset,
    uniform: reset ? uniform : null,
    branchDraw,
    observationDraw,
  };
}
export function simulationReducer(s: Simulation, a: Action): Simulation {
  switch (a.type) {
    case "configure":
      return initialize(a.parameters);
    case "reset":
      return initialize(s.parameters);
    case "play":
      return { ...s, playing: true };
    case "pause":
      return { ...s, playing: false };
    case "seek":
      return {
        ...s,
        cursor: Math.max(0, Math.min(s.frames.length - 1, a.cursor)),
        playing: false,
      };
    case "step": {
      const next = s.cursor + 1;
      if (next >= MAX_STEPS) return { ...s, playing: false };
      if (a.force === undefined && next < s.frames.length)
        return {
          ...s,
          cursor: next,
          playing: s.playing && !(a.pauseOnReveal && s.frames[next].revealed),
        };
      const frame = advance(s.frames[s.cursor], s.parameters, a.force);
      return {
        ...s,
        frames: [...s.frames.slice(0, next), frame],
        cursor: next,
        playing: s.playing && !(a.pauseOnReveal && frame.revealed),
      };
    }
  }
}
