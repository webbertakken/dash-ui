import type { CSSProperties, HTMLAttributes, ReactNode } from 'react'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  span?: number
  children?: ReactNode
}

export function Card({ span, style, className = '', children, ...rest }: CardProps) {
  const merged: CSSProperties = { ...style, ...(span ? { gridColumn: `span ${span}` } : null) }
  return (
    <div className={`card ${className}`.trim()} style={merged} {...rest}>
      {children}
    </div>
  )
}

export interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  children?: ReactNode
}

export function CardTitle({ children, className = '', ...rest }: CardTitleProps) {
  return (
    <h3 className={className} {...rest}>
      {children}
    </h3>
  )
}
