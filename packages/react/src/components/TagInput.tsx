import { useId, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import { Tag } from './Tag.js';

export interface TagInputProps {
  label?: string;
  value?: string[];
  defaultValue?: string[];
  onChange?: (tags: string[]) => void;
  placeholder?: string;
  id?: string;
  disabled?: boolean;
  className?: string;
}

export function TagInput({
  label,
  value: valueProp,
  defaultValue = [],
  onChange,
  placeholder = 'Type and press Enter…',
  id,
  disabled = false,
  className = '',
}: TagInputProps) {
  const gid = useId();
  const inputId = id ?? gid;
  const listId = `${inputId}-list`;

  const [internal, setInternal] = useState<string[]>(defaultValue);
  const [draft, setDraft] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const tags = valueProp !== undefined ? valueProp : internal;

  function commit(next: string[]) {
    if (valueProp === undefined) setInternal(next);
    onChange?.(next);
  }

  function addTag(raw: string) {
    const trimmed = raw.trim();
    if (!trimmed || tags.includes(trimmed)) return;
    commit([...tags, trimmed]);
    setDraft('');
  }

  function removeTag(index: number) {
    commit(tags.filter((_, i) => i !== index));
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' || e.key === ',' || e.key === 'Tab') {
      if (draft.trim()) {
        e.preventDefault();
        addTag(draft);
      }
    } else if (e.key === 'Backspace' && draft === '' && tags.length > 0) {
      removeTag(tags.length - 1);
    }
  }

  return (
    <div className={`tag-input-wrapper${className ? ` ${className}` : ''}`}>
      {label && (
        <label htmlFor={inputId} className="tag-input__label">{label}</label>
      )}
      <div
        id={listId}
        role="group"
        aria-label={label ?? 'Tags'}
        className={`tag-input${disabled ? ' tag-input--disabled' : ''}`}
        onClick={() => inputRef.current?.focus()}
      >
        {tags.map((t, i) => (
          <Tag
            key={t}
            label={t}
            onRemove={disabled ? undefined : () => removeTag(i)}
          />
        ))}
        <input
          ref={inputRef}
          id={inputId}
          type="text"
          className="tag-input__field"
          value={draft}
          disabled={disabled}
          placeholder={tags.length === 0 ? placeholder : ''}
          aria-label={label ?? 'Add tag'}
          autoComplete="off"
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => { if (draft.trim()) addTag(draft); }}
        />
      </div>
    </div>
  );
}
