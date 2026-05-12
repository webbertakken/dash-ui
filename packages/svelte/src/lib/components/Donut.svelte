<script module lang="ts">
  export interface DonutSegment { label: string; value: number; color: string }
</script>

<script lang="ts">
  interface Props {
    size?: number;
    segments?: DonutSegment[];
    centerValue: string | number;
    centerLabel: string;
    trackColor?: string;
    ariaLabel?: string | undefined;
  }

  let {
    size = 96,
    segments = [],
    centerValue,
    centerLabel,
    trackColor = 'rgba(255,255,255,0.06)',
    ariaLabel = undefined
  }: Props = $props();

  let total = $derived(segments.reduce((s, x) => s + x.value, 0) || 1);
  let r = $derived((size - 20) / 2);
  let c = $derived(2 * Math.PI * r);
  let segDesc = $derived(segments.map((s) => `${s.label} ${Math.round((s.value / total) * 100)}%`).join(', '));
  let label = $derived(ariaLabel ?? `${centerValue} ${centerLabel}${segDesc ? `: ${segDesc}` : ''}`);
  let arcs = $derived((() => {
    let cum = 0;
    return segments.map((seg) => {
      const frac = seg.value / total;
      const offset = c * (1 - cum - frac);
      const rotate = cum * 360;
      cum += frac;
      return { ...seg, offset, rotate };
    });
  })());
</script>

<div role="img" aria-label={label} style="position:relative;width:{size}px;height:{size}px;flex-shrink:0;">
  <svg width={size} height={size} aria-hidden="true" focusable="false" style="transform:rotate(-90deg);">
    <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={trackColor} stroke-width="10" />
    {#each arcs as a (a.label)}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={a.color}
        stroke-width="10"
        stroke-dasharray={c}
        stroke-dashoffset={a.offset}
        stroke-linecap="round"
        transform="rotate({a.rotate} {size / 2} {size / 2})"
      />
    {/each}
  </svg>
  <div aria-hidden="true" style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;">
    <div style="font-size:20px;font-weight:600;letter-spacing:-0.01em;font-variant-numeric:tabular-nums;">{centerValue}</div>
    <div style="font-size:10px;color:#6E7079;">{centerLabel}</div>
  </div>
</div>
