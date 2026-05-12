<script lang="ts">
  interface Props {
    data?: { label: string; value: number }[];
    height?: number;
    colorLow?: string;
    colorHigh?: string;
    ariaLabel?: string;
  }

  let {
    data = [],
    height = 48,
    colorLow = '#0A2840',
    colorHigh = '#FF4040',
    ariaLabel = 'Stripe chart'
  }: Props = $props();

  function hexToRgb(hex: string): [number, number, number] {
    const h = hex.replace('#', '');
    const n = parseInt(h, 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  function lerp(a: number, b: number, t: number) {
    return Math.round(a + (b - a) * t);
  }
  function interpColor(low: string, high: string, t: number): string {
    const [r1, g1, b1] = hexToRgb(low);
    const [r2, g2, b2] = hexToRgb(high);
    return `rgb(${lerp(r1, r2, t)},${lerp(g1, g2, t)},${lerp(b1, b2, t)})`;
  }

  let vals = $derived(data.map((d) => d.value));
  let min = $derived(vals.length ? Math.min(...vals) : 0);
  let max = $derived(vals.length ? Math.max(...vals) : 1);
  let range = $derived((max - min) || 1);
  let sw = $derived(400 / (data.length || 1));
  let stripes = $derived(data.map((d, i) => ({
    x: i * sw,
    w: sw,
    color: interpColor(colorLow, colorHigh, (d.value - min) / range),
    label: d.label,
    value: d.value,
  })));
</script>

<div role="img" aria-label={ariaLabel} style="line-height:0;">
  <svg
    viewBox="0 0 400 {height}"
    width="100%"
    height={height}
    aria-hidden="true"
    focusable="false"
    preserveAspectRatio="none"
  >
    {#each stripes as s, i (i)}
      <g>
        <rect x={s.x} y={0} width={s.w} height={height} fill={s.color} />
        <title>{s.label}: {s.value}</title>
      </g>
    {/each}
  </svg>
</div>
