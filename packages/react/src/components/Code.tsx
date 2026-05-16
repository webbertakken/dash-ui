import type { HTMLAttributes, ReactNode } from 'react'

export interface CodeProps extends HTMLAttributes<HTMLElement> {
  children?: ReactNode
}

/**
 * Inline code snippet for key names, config paths, environment variables
 * and other short literal strings that read inside body copy. Renders a
 * `<code class="dash-ui-code">` so the `.dash-ui-code` rule in
 * `@w5-ui/tokens/css` applies the canonical JetBrains Mono family, 12 px
 * size, muted text colour, and the inset `--depthBg-2` chip background
 * with a 1 px border. Stops userland reaching for bare `<code>` (which
 * falls back to a serif monospace on `#fff`) or inline `font-family` /
 * `background` overrides on every snippet.
 *
 * Typed equivalent of `<code className="dash-ui-code">`. Reach for
 * `<CodeBlock>` when the snippet wraps to multiple lines and wants a
 * full block surface; this primitive is for the inline case.
 */
export function Code({ className = '', children, ...rest }: CodeProps) {
  return (
    <code className={`dash-ui-code ${className}`.trim()} {...rest}>
      {children}
    </code>
  )
}
