<script lang="ts">
  export let data: { label: string; value: number }[] = [];
  export let height: number = 48;
  export let colorLow: string = '#0A2840';
  export let colorHigh: string = '#FF4040';
  export let ariaLabel: string = 'Stripe chart';

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

  $: vals = data.map((d) => d.value);
  $: min = vals.length ? Math.min(...vals) : 0;
  $: max = vals.length ? Math.max(...vals) : 1;
  $: range = (max - min) || 1;
  $: sw = 400 / (data.length || 1);
  $: stripes = data.map((d, i) => ({
    x: i * sw,
    w: sw,
    color: interpColor(colorLow, colorHigh, (d.value - min) / range),
    label: d.label,
    value: d.value,
  }));
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
