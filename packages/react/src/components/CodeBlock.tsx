import { CopyButton } from './CopyButton.js'

export interface CodeBlockProps {
  code: string
  label?: string
  language?: string
  className?: string
}

export function CodeBlock({
  code,
  label = 'Code block',
  language,
  className = '',
}: CodeBlockProps) {
  return (
    <div role="region" aria-label={label} className={`code-block ${className}`.trim()}>
      <div className="code-block__header">
        {language && <span className="code-block__lang">{language}</span>}
        <CopyButton text={code} label="Copy code" />
      </div>
      <pre className="code-block__pre">
        <code className="code-block__code">{code}</code>
      </pre>
    </div>
  )
}
