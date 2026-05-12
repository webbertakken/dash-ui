<script lang="ts">
  interface Props {
    value?: number;
    label?: string;
    color?: string;
    size?: number;
    ariaLabel?: string | undefined;
  }

  let {
    value = 0,
    label = '',
    color = '#006FFF',
    size = 120,
    ariaLabel = undefined
  }: Props = $props();

  
  let cx = $derived(size / 2);
  let cy = $derived(size / 2);
  let r = $derived(cx - sw / 2 - 2);
  let svgH = $derived(Math.round(size * 0.7));
  let pathLen = $derived(Math.PI * r);
  let fillLen = $derived((Math.min(100, Math.max(0, value)) / 100) * pathLen);
  let d = $derived(`M ${cx - r},${cy} A ${r},${r} 0 1 1 ${cx + r},${cy}`);
  let valY = $derived(cy + Math.round(size * 0.06));
  let lblY = $derived(valY + Math.round(size * 0.13) + 2);
  let a11yLabel = $derived(ariaLabel ?? `${label} ${value}%`);
</script>

<div
  role="meter"
  aria-valuenow={value}
  aria-valuemin={0}
  aria-valuemax={100}
  aria-label={a11yLabel}
  style="display:inline-flex;flex-direction:column;align-items:center;"
>
  <svg width={size} height={svgH} aria-hidden="true" focusable="false">
    <path {d} fill="none" stroke="rgba(255,255,255,0.08)" stroke-width={sw} stroke-linecap="round" />
    <path
      {d}
      fill="none"
      stroke={color}
      stroke-width={sw}
      stroke-linecap="round"
      stroke-dasharray="{fillLen} {pathLen}"
    />
    <text
      x={cx}
      y={valY}
      text-anchor="middle"
      fill="#fff"
      font-size={Math.round(size * 0.2)}
      font-weight={600}
    >
      {value}%
    </text>
    <text x={cx} y={lblY} text-anchor="middle" fill="#6E7079" font-size={Math.round(size * 0.1)}>
      {label}
    </text>
  </svg>
</div>
