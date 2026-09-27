import { createShadowStyler } from './shadow-styles.ts'
import css from './shadow.css?inline'

/** The shared styler every generated `uni-*` wrapper extends with. */
export const shadowStyles = createShadowStyler(css)
export const withShadowStyles = shadowStyles.extend
