import { useState, useCallback } from 'react';

const CopyIcon = () => (
  <svg viewBox="0 0 14 14" width="14" height="14" fill="none" aria-hidden="true" focusable={false}>
    <rect x="4" y="1" width="9" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
    <rect x="1" y="4" width="9" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

const CheckIcon = () => (
  <svg viewBox="0 0 14 14" width="14" height="14" fill="none" aria-hidden="true" focusable={false}>
    <path d="M2.5 7.5l3.5 3.5L12 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export interface CopyButtonProps {
  text: string;
  label?: string;
}

export function CopyButton({ text, label = 'Copy' }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [text]);

  return (
    <button
      type="button"
      className={`copy-btn${copied ? ' copy-btn--done' : ''}`}
      aria-label={copied ? 'Copied!' : label}
      onClick={handleCopy}
    >
      {copied ? <CheckIcon /> : <CopyIcon />}
    </button>
  );
}
