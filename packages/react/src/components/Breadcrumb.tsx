export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  onNavigate?: (index: number) => void;
  className?: string;
}

export function Breadcrumb({ items, onNavigate, className = '' }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className={`breadcrumb ${className}`.trim()}>
      <ol className="breadcrumb__list">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={i} className="breadcrumb__item">
              {isLast ? (
                <span aria-current="page" className="breadcrumb__current">{item.label}</span>
              ) : item.href ? (
                <a href={item.href} className="breadcrumb__link">{item.label}</a>
              ) : (
                <button type="button" className="breadcrumb__link" onClick={() => onNavigate?.(i)}>{item.label}</button>
              )}
              {!isLast && <span aria-hidden="true" className="breadcrumb__sep">/</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
