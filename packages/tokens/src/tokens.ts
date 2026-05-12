/**
 * Typed mirror of `tokens.css`. Use the CSS variables in styling and these
 * constants when you need a value in JS (charts, inline SVG fills, etc).
 */

export const brand = {
  '01': '#001F70',
  '02': '#003386',
  '03': '#003C9E',
  '04': '#005ED9',
  '05': '#006FFF',
  '06': '#4797FF',
  '07': '#78C8F5',
  '08': '#B8DBFF',
  '09': '#E5F1FF',
} as const

export const status = {
  success: '#00B070',
  warning: '#F5A623',
  danger: '#F03A3A',
  info: brand['05'],
  neutral: '#6E7079',
} as const

export const neutral = {
  '00': '#FFFFFF',
  '01': '#F6F6F7',
  '02': '#ECECEE',
  '03': '#D6D6DA',
  '04': '#A4A7B5',
  '05': '#6E7079',
  '06': '#4A4B53',
  '07': '#2D2F36',
  '08': '#1C1C1E',
  '09': '#141415',
  '10': '#0A0A0B',
} as const

export const space = {
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  7: 32,
  8: 40,
  9: 48,
  10: 64,
  11: 80,
  12: 96,
} as const

export const radius = {
  sm: 4,
  md: 6,
  lg: 12,
  xl: 16,
  app: '22%',
  pill: 9999,
} as const

export const fontSize = {
  11: 11,
  12: 12,
  13: 13,
  14: 14,
  15: 15,
  16: 16,
  18: 18,
  20: 20,
  24: 24,
  30: 30,
  38: 38,
  48: 48,
  64: 64,
} as const

export const fontWeight = {
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 800,
} as const

export type Motif = 'dark' | 'light'
