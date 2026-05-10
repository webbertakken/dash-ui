export interface RankedItem {
  label: string;
  value: number;
  sublabel?: string;
  color?: string;
}

export interface RankedListProps {
  items: RankedItem[];
  unit?: string;
  max?: number;
  ariaLabel?: string;
}

export function RankedList({ items, unit, max: maxProp, ariaLabel = 'Ranked list' }: RankedListProps) {
  const max = maxProp ?? Math.max(...items.map((i) => i.value), 1);
  return (
    <table className="rl" aria-label={ariaLabel}>
      <caption className="sr-only">{ariaLabel}</caption>
      <thead className="sr-only">
        <tr>
          <th scope="col">#</th>
          <th scope="col">Name</th>
          <th scope="col">Distribution</th>
          <th scope="col">{unit ?? 'Value'}</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item, i) => (
          <tr key={i} className="rl-row">
            <td className="rl-rank">{i + 1}</td>
            <td className="rl-label-cell">
              <div className="rl-label">{item.label}</div>
              {item.sublabel && <div className="rl-sublabel">{item.sublabel}</div>}
            </td>
            <td className="rl-bar-col" aria-hidden="true">
              <div className="rl-bar-track">
                <div
                  className="rl-bar-fill"
                  style={{ width: `${((item.value / max) * 100).toFixed(1)}%`, background: item.color ?? '#006FFF' }}
                />
              </div>
            </td>
            <td className="rl-val">
              {item.value.toLocaleString()}
              {unit && <span className="rl-unit"> {unit}</span>}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
