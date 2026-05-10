import { useState, useRef, useId } from 'react';

const PencilIcon = () => (
  <svg viewBox="0 0 14 14" width="12" height="12" fill="none" aria-hidden="true" focusable={false}>
    <path d="M9.5 2l2.5 2.5-8 8H1.5v-2.5l8-8z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CheckIcon = () => (
  <svg viewBox="0 0 14 14" width="12" height="12" fill="none" aria-hidden="true" focusable={false}>
    <path d="M2.5 7.5l3.5 3.5L12 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CrossIcon = () => (
  <svg viewBox="0 0 14 14" width="12" height="12" fill="none" aria-hidden="true" focusable={false}>
    <path d="M3 3l8 8M11 3l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export interface InlineEditProps {
  value: string;
  onConfirm: (value: string) => void;
  label: string;
  placeholder?: string;
}

export function InlineEdit({ value, onConfirm, label, placeholder }: InlineEditProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);
  const editBtnRef = useRef<HTMLButtonElement>(null);
  const inputId = useId();

  function startEdit() {
    setDraft(value);
    setEditing(true);
    requestAnimationFrame(() => inputRef.current?.focus());
  }

  function confirm() {
    const trimmed = draft.trim();
    if (trimmed) onConfirm(trimmed);
    setEditing(false);
    requestAnimationFrame(() => editBtnRef.current?.focus());
  }

  function cancel() {
    setDraft(value);
    setEditing(false);
    requestAnimationFrame(() => editBtnRef.current?.focus());
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') { e.preventDefault(); confirm(); }
    if (e.key === 'Escape') { e.preventDefault(); cancel(); }
  }

  if (editing) {
    return (
      <span className="ie ie--editing">
        <input
          ref={inputRef}
          id={inputId}
          className="ie__input"
          aria-label={`Edit ${label}`}
          value={draft}
          placeholder={placeholder}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button type="button" className="ie__btn ie__btn--save" aria-label="Save" onClick={confirm}>
          <CheckIcon />
        </button>
        <button type="button" className="ie__btn ie__btn--cancel" aria-label="Cancel" onClick={cancel}>
          <CrossIcon />
        </button>
      </span>
    );
  }

  return (
    <span className="ie">
      <span className="ie__text">{value}</span>
      <button
        ref={editBtnRef}
        type="button"
        className="ie__edit"
        aria-label={`Edit ${label}`}
        onClick={startEdit}
      >
        <PencilIcon />
      </button>
    </span>
  );
}
