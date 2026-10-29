/** Forward-mode autodiff through a deterministic, untrained causal Transformer.
 * Two residual blocks, one attention head, d_model=4, tanh feed-forward.
 * Deliberately omits layer norm and training to keep the computation inspectable.
 */
export const TOKENS = ["The", "cat", "sat", "on", "the", "mat"];
export const WIDTH = 4;
export const IDENTITY_MATRIX = Array.from({ length: WIDTH }, (_, row) =>
  Array.from({ length: WIDTH }, (_, column) => +(row === column)),
);
type Dual = { v: number; g: number[] };
const constant = (v: number): Dual => ({ v, g: Array(WIDTH).fill(0) });
const add = (a: Dual, b: Dual): Dual => ({
  v: a.v + b.v,
  g: a.g.map((x, i) => x + b.g[i]),
});
const mul = (a: Dual, b: Dual): Dual => ({
  v: a.v * b.v,
  g: a.g.map((x, i) => x * b.v + a.v * b.g[i]),
});
const scale = (a: Dual, n: number) => mul(a, constant(n));
const unary = (
  a: Dual,
  f: (x: number) => number,
  df: (x: number) => number,
): Dual => ({ v: f(a.v), g: a.g.map((x) => x * df(a.v)) });
const exp = (a: Dual) => unary(a, Math.exp, Math.exp);
const inverse = (a: Dual) =>
  unary(
    a,
    (x) => 1 / x,
    (x) => -1 / (x * x),
  );
const tanh = (a: Dual) => unary(a, Math.tanh, (x) => 1 - Math.tanh(x) ** 2);
const sum = (a: Dual[]) => a.reduce(add, constant(0));
function project(x: Dual[], layer: number, kind: number) {
  return x.map((_, out) =>
    sum(
      x.map((a, input) =>
        scale(
          a,
          Math.sin((layer + 1) * 17 + kind * 11 + out * 7 + input * 3) * 0.45,
        ),
      ),
    ),
  );
}
function block(h: Dual[][], layer: number) {
  const q = h.map((x) => project(x, layer, 1)),
    k = h.map((x) => project(x, layer, 2)),
    v = h.map((x) => project(x, layer, 3));
  return h.map((x, target) => {
    const logits = k
      .slice(0, target + 1)
      .map((key) =>
        scale(
          sum(q[target].map((a, i) => mul(a, key[i]))),
          1 / Math.sqrt(WIDTH),
        ),
      );
    const max = Math.max(...logits.map((a) => a.v));
    const weights = logits.map((a) => exp(add(a, constant(-max))));
    const denom = inverse(sum(weights));
    const attention = x.map((_, i) =>
      sum(weights.map((w, j) => mul(mul(w, denom), v[j][i]))),
    );
    const attentionOutput = project(attention, layer, 4);
    const residual = x.map((a, i) => add(a, attentionOutput[i]));
    const ff = project(project(residual, layer, 5).map(tanh), layer, 6);
    return residual.map((a, i) => add(a, ff[i]));
  });
}
export const norm = (xs: number[]) =>
  Math.sqrt(xs.reduce((s, x) => s + x * x, 0));

/** Width-4 input and two causal Transformer blocks, with full 4×4 derivatives. */
export function runGraphTransformer(
  source: number,
  perturbation = 0,
  direction = 0,
) {
  const input = TOKENS.map((_, t) =>
    Array.from(
      { length: WIDTH },
      (_, i): Dual => ({
        v:
          Math.sin((t + 1) * (i + 1) * 0.7) +
          (t === source && i === direction ? perturbation : 0),
        g: Array.from({ length: WIDTH }, (_, j) =>
          t === source && i === j ? 1 : 0,
        ),
      }),
    ),
  );
  const first = block(input, 0);
  const second = block(first, 1);
  return [input, first, second].map((level) => ({
    values: level.map((x) => x.map((a) => a.v)),
    jacobians: level.map((x) => x.map((a) => a.g)),
  }));
}
export function averageJacobians(matrices: number[][][]) {
  if (!matrices.length) return null;
  return matrices[0].map((row, i) =>
    row.map(
      (_, j) => matrices.reduce((s, m) => s + m[i][j], 0) / matrices.length,
    ),
  );
}

/** Fixed educational unembedding, not a learned language-model decoder. */
export function readGraphLens(
  matrix: number[][],
  input: number[],
  normalize: boolean,
) {
  const response = matrix.map((row) =>
    row.reduce((sum, value, i) => sum + value * input[i], 0),
  );
  const length = norm(response);
  const decoded = normalize
    ? response.map((value) => value / Math.max(length, 1e-12))
    : response;
  const logits = TOKENS.map((_, token) =>
    decoded.reduce(
      (sum, value, dimension) =>
        sum + value * Math.sin(3 + token * 5 + dimension * 2) * 1.3,
      0,
    ),
  );
  const maximum = Math.max(...logits);
  const weights = logits.map((value) => Math.exp(value - maximum));
  const total = weights.reduce((sum, value) => sum + value, 0);
  return {
    response,
    logits,
    probabilities: weights.map((value) => value / total),
  };
}
