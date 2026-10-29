export type ResponseVector = readonly [number, number];
const length = (v: ResponseVector) => Math.hypot(...v);
const average = (vectors: readonly ResponseVector[]): ResponseVector =>
  vectors.length
    ? [
        vectors.reduce((sum, v) => sum + v[0], 0) / vectors.length,
        vectors.reduce((sum, v) => sum + v[1], 0) / vectors.length,
      ]
    : [0, 0];
export function coherenceFactors(
  responses: readonly (readonly ResponseVector[])[],
) {
  const rows = responses.filter((row) => row.length);
  const rowMeans = rows.map(average);
  const magnitude = rows.length
    ? rows.reduce(
        (sum, row) => sum + row.reduce((s, v) => s + length(v), 0) / row.length,
        0,
      ) / rows.length
    : 0;
  const lagAveragedMagnitude = rowMeans.length
    ? rowMeans.reduce((sum, v) => sum + length(v), 0) / rowMeans.length
    : 0;
  const finalVector = average(rowMeans);
  const finalMagnitude = length(finalVector);
  return {
    magnitude,
    lagCoherence: magnitude ? lagAveragedMagnitude / magnitude : 0,
    contextCoherence: lagAveragedMagnitude
      ? finalMagnitude / lagAveragedMagnitude
      : 0,
    rowMeans,
    finalVector,
    finalMagnitude,
  };
}
export function responseFromAngle(
  angle: number,
  magnitude: number,
): ResponseVector {
  // Rounded diagram coordinates keep SSR attributes stable across JS engines.
  return [
    (Math.round(Math.cos((angle * Math.PI) / 180) * 1e12) / 1e12) * magnitude,
    (Math.round(Math.sin((angle * Math.PI) / 180) * 1e12) / 1e12) * magnitude,
  ];
}

/** Balanced signs give exact, independently adjustable lag and context coherences. */
export function buildResponses(
  a: number,
  lag: number,
  context: number,
): ResponseVector[][] {
  const c = Math.sqrt(Math.max(0, 1 - context * context)),
    l = Math.sqrt(Math.max(0, 1 - lag * lag));
  return [1, 1, -1, -1].map((sign) =>
    Array.from({ length: 8 }, (_, t) => {
      const flip = t % 2 ? -1 : 1;
      return [
        a * (lag * context - flip * l * sign * c),
        a * (lag * sign * c + flip * l * context),
      ] as ResponseVector;
    }),
  );
}
