<script lang="ts">
  export interface DonutSegment { label: string; value: number; color: string }
  export let size: number = 96;
  export let segments: DonutSegment[] = [];
  export let centerValue: string | number;
  export let centerLabel: string;
  export let trackColor: string = 'rgba(255,255,255,0.06)';

  $: total = segments.reduce((s, x) => s + x.value, 0) || 1;
  $: r = (size - 20) / 2;
  $: c = 2 * Math.PI * r;
  $: arcs = (() => {
    let cum = 0;
    return segments.map((seg) => {
      const frac = seg.value / total;
      const offset = c * (1 - cum - frac);
      const rotate = cum * 360;
      cum += frac;
      return { ...seg, offset, rotate };
    });
  })();
</script>

<div style="position:relative;width:{size}px;height:{size}px;flex-shrink:0;">
  <svg width={size} height={size} style="transform:rotate(-90deg);">
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
  <div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;">
    <div style="font-size:20px;font-weight:600;letter-spacing:-0.01em;font-variant-numeric:tabular-nums;">{centerValue}</div>
    <div style="font-size:10px;color:#6E7079;">{centerLabel}</div>
  </div>
</div>
