export interface TagProps {
  label: string;
  onRemove?: () => void;
  className?: string;
}

export function Tag({ label, onRemove, className = '' }: TagProps) {
  return (
    <span className={`tag ${className}`.trim()}>
      <span className="tag__label">{label}</span>
      {onRemove && (
        <button
          type="button"
          className="tag__remove"
          aria-label={`Remove ${label} filter`}
          onClick={onRemove}
        >
          <svg viewBox="0 0 10 10" width="10" height="10" fill="none" aria-hidden="true" focusable={false}>
            <path d="M2 2l6 6M8 2l-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      )}
    </span>
  );
}
