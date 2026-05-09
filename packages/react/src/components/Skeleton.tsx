import type { CSSProperties } from 'react';

export type SkeletonVariant = 'text' | 'title' | 'stat' | 'circle' | 'block';

export interface SkeletonProps {
  variant?: SkeletonVariant;
  width?: number | string;
  height?: number | string;
  className?: string;
  style?: CSSProperties;
  ariaLabel?: string;
}

export function Skeleton({
  variant = 'text',
  width,
  height,
  className = '',
  style,
  ariaLabel = 'Loading',
}: SkeletonProps) {
  const variantClass = variant === 'block' ? '' : variant;
  const mergedStyle: CSSProperties = {
    width: width ?? (variant === 'circle' ? height : undefined),
    height,
    ...style,
  };
  return (
    <span
      className={`skeleton ${variantClass} ${className}`.trim()}
      style={mergedStyle}
      role="status"
      aria-label={ariaLabel}
      aria-busy="true"
    />
  );
}
