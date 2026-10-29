import s from "./explorer.module.css";
export function JacobianMatrix({
  matrix,
  scale,
  label,
}: {
  matrix: number[][];
  scale: number;
  label: string;
}) {
  return (
    <table className={s.graphMatrix} aria-label={label}>
      <thead>
        <tr>
          <th>out / in</th>
          {[1, 2, 3, 4].map((i) => (
            <th key={i}>{i}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {matrix.map((row, i) => (
          <tr key={i}>
            <th>{i + 1}</th>
            {row.map((v, j) => (
              <td
                key={j}
                style={{
                  background: `rgba(${v < 0 ? "151,18,51" : "30,78,132"},${(0.025 + 0.22 * Math.min(1, Math.abs(v) / scale)).toFixed(4)})`,
                }}
              >
                {v.toFixed(3)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
