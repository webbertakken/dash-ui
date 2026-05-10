<script lang="ts">
  export let value: number = 0;
  export let label: string = '';
  export let color: string = '#006FFF';
  export let size: number = 120;
  export let ariaLabel: string | undefined = undefined;

  $: sw = 10;
  $: cx = size / 2;
  $: cy = size / 2;
  $: r = cx - sw / 2 - 2;
  $: svgH = Math.round(size * 0.7);
  $: pathLen = Math.PI * r;
  $: fillLen = (Math.min(100, Math.max(0, value)) / 100) * pathLen;
  $: d = `M ${cx - r},${cy} A ${r},${r} 0 1 1 ${cx + r},${cy}`;
  $: valY = cy + Math.round(size * 0.06);
  $: lblY = valY + Math.round(size * 0.13) + 2;
  $: a11yLabel = ariaLabel ?? `${label} ${value}%`;
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
