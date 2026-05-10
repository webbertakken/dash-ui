import type { ReactNode } from 'react';

export interface KVRow {
  label: string;
  value: ReactNode;
}

export interface KVTableProps {
  rows: KVRow[];
  caption?: string;
}

export function KVTable({ rows, caption }: KVTableProps) {
  return (
    <table className="kv-table">
      {caption && <caption className="sr-only">{caption}</caption>}
      <tbody>
        {rows.map(({ label, value }) => (
          <tr key={label} className="kv-table__row">
            <th scope="row" className="kv-table__label">{label}</th>
            <td className="kv-table__value">{value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
