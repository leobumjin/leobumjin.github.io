import s from "../hmm.module.css";
export function Distribution({
  values,
  labels,
}: {
  values: number[];
  labels: string[];
}) {
  return (
    <div
      className={s.distribution}
      role="img"
      aria-label={values
        .map((v, i) => `${labels[i]}: ${v.toFixed(3)}`)
        .join(", ")}
    >
      <div className={s.bars}>
        {values.map((v, i) => (
          <div key={i}>
            <span>{(v * 100).toFixed(1)}%</span>
            <div className={s.barTrack}>
              <i
                style={{
                  height: `${(v * 100).toFixed(4)}%`,
                  background:
                    i === values.length - 1 && labels[i] === "NULL"
                      ? "#9b153b"
                      : "#315c8d",
                }}
              />
            </div>
            <b>{labels[i]}</b>
          </div>
        ))}
      </div>
      <p>공통 세로축 0–1 · 막대 높이는 확률</p>
    </div>
  );
}
