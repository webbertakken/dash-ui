<script module lang="ts">
  export interface StreamSeries {
    label: string;
    values: number[];
    color?: string;
  }
</script>

<script lang="ts">

  interface Props {
    labels?: string[];
    series?: StreamSeries[];
    ariaLabel?: string;
  }

  let { labels = [], series = [], ariaLabel = 'Stream graph' }: Props = $props();

  const VW = 380;
  const VH = 120;
  const PAD_L = 8;
  const PAD_R = 8;
  const PAD_T = 8;
  const PAD_B = 20;
  const COLORS = ['#006FFF', '#00C8C8', '#F5A623', '#7FB6FF', '#A878F5', '#F56342'];

  let n = $derived(labels.length);
  let TRACK_W = $derived(VW - PAD_L - PAD_R);
  let TRACK_H = $derived(VH - PAD_T - PAD_B);

  let totals = $derived(Array.from({ length: n }, (_, i) =>
    series.reduce((sum, s) => sum + (s.values[i] ?? 0), 0)
  ));
  let maxTotal = $derived(Math.max(...totals, 1));

  function xOf(i: number): number {
    return n > 1 ? PAD_L + (i / (n - 1)) * TRACK_W : PAD_L + TRACK_W / 2;
  }

  let layers = $derived(series.map((s, si) => {
    const tops: number[] = [];
    const bots: number[] = [];
    for (let i = 0; i < n; i++) {
      const total = totals[i];
      const baseline = (maxTotal - total) / 2;
      let bottom = baseline;
      for (let k = 0; k < si; k++) bottom += series[k].values[i] ?? 0;
      const top = bottom + (s.values[i] ?? 0);
      bots[i] = PAD_T + (bottom / maxTotal) * TRACK_H;
      tops[i] = PAD_T + (top / maxTotal) * TRACK_H;
    }
    return { tops, bots, color: s.color ?? COLORS[si % COLORS.length] };
  }));

  function buildArea(tops: number[], bots: number[]): string {
    const fwd = tops.map((y, i) => {
      const x = xOf(i);
      if (i === 0) return `M${x},${y}`;
      const px = xOf(i - 1);
      const cpX = (px + x) / 2;
      return `C${cpX},${tops[i - 1]} ${cpX},${y} ${x},${y}`;
    });
    const bwd = [...bots].reverse().map((y, ri) => {
      const i = bots.length - 1 - ri;
      const x = xOf(i);
      if (ri === 0) return `L${x},${y}`;
      const nx = xOf(i + 1);
      const cpX = (nx + x) / 2;
      return `C${cpX},${bots[i + 1]} ${cpX},${y} ${x},${y}`;
    });
    return [...fwd, ...bwd, 'Z'].join(' ');
  }
</script>

<div role="img" aria-label={ariaLabel} style="width:100%;">
  <svg
    viewBox="0 0 {VW} {VH}"
    style="width:100%;height:auto;display:block;"
    aria-hidden="true"
    focusable="false"
  >
    {#each layers as layer, si (si)}
      <path
        d={buildArea(layer.tops, layer.bots)}
        fill={layer.color}
        opacity="0.82"
      />
    {/each}
    {#each labels as label, i (i)}
      <text
        x={xOf(i)}
        y={VH - 5}
        fill="#6E7079"
        font-size="9"
        text-anchor={i === 0 ? 'start' : i === n - 1 ? 'end' : 'middle'}
        font-family="inherit"
      >{label}</text>
    {/each}
  </svg>
</div>
