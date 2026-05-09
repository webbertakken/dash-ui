import type { AnchorHTMLAttributes } from 'react';

export interface SkipLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href?: string;
  children?: React.ReactNode;
}

export function SkipLink({ href = '#main-content', children = 'Skip to main content', className = '', ...rest }: SkipLinkProps) {
  return (
    <a className={`skip-link ${className}`.trim()} href={href} {...rest}>
      {children}
    </a>
  );
}
