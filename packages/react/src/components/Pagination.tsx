import type { HTMLAttributes } from 'react';

export interface PaginationProps extends Omit<HTMLAttributes<HTMLElement>, 'onChange'> {
  page: number;
  pageSize: number;
  total: number;
  onChange: (page: number) => void;
}

function pageNumbers(page: number, totalPages: number): (number | '...')[] {
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
  const items: (number | '...')[] = [1];
  const lo = Math.max(2, page - 1);
  const hi = Math.min(totalPages - 1, page + 1);
  if (lo > 2) items.push('...');
  for (let i = lo; i <= hi; i++) items.push(i);
  if (hi < totalPages - 1) items.push('...');
  items.push(totalPages);
  return items;
}

export function Pagination({ page, pageSize, total, onChange, className = '', ...rest }: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  if (totalPages <= 1) return null;
  const pages = pageNumbers(page, totalPages);
  return (
    <nav className={`pagination ${className}`.trim()} aria-label="Pagination" {...rest}>
      <button
        type="button"
        className="pagination-btn"
        aria-label="Previous page"
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
      >
        ‹
      </button>
      {pages.map((p, i) =>
        p === '...' ? (
          <span key={`e${i}`} className="pagination-ellipsis" aria-hidden="true">…</span>
        ) : (
          <button
            key={p}
            type="button"
            className={`pagination-btn${p === page ? ' active' : ''}`}
            aria-label={`Page ${p}`}
            aria-current={p === page ? 'page' : undefined}
            onClick={() => onChange(p)}
          >
            {p}
          </button>
        )
      )}
      <button
        type="button"
        className="pagination-btn"
        aria-label="Next page"
        disabled={page >= totalPages}
        onClick={() => onChange(page + 1)}
      >
        ›
      </button>
    </nav>
  );
}
