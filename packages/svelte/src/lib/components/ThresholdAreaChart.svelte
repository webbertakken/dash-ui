<script module>
  let _n = 0;
</script>
<script lang="ts">
  const uid = `tac${_n++}`;

  interface Props {
    values: number[];
    labels?: string[];
    threshold: number;
    thresholdLabel?: string | undefined;
    belowColor?: string;
    aboveColor?: string;
    height?: number;
    ariaLabel?: string;
  }

  let {
    values,
    labels = [],
    threshold,
    thresholdLabel = undefined,
    belowColor = '#00C875',
    aboveColor = '#FF7B7B',
    height = 160,
    ariaLabel = 'Threshold area chart'
  }: Props = $props();

  const VW = 400;
  const PAD = { t: 16, r: 8, b: 28, l: 8 };

  let n = $derived(values.length);
  let chartW = $derived(VW - PAD.l - PAD.r);
  let chartH = $derived(height - PAD.t - PAD.b);
  let maxV = $derived(Math.max(...values, threshold, 1));
  let toX = $derived((i: number) => PAD.l + (n > 1 ? (i / (n - 1)) * chartW : chartW / 2));
  let toY = $derived((v: number) => PAD.t + chartH - (v / maxV) * chartH);
  let threshY = $derived(toY(threshold));
  let baseY = $derived(PAD.t + chartH);
  let pts = $derived(values.map((v, i) => `${toX(i).toFixed(1)},${toY(v).toFixed(1)}`));
  let d = $derived(`M ${pts.join(' L ')} L ${toX(n - 1).toFixed(1)},${baseY} L ${toX(0).toFixed(1)},${baseY} Z`);
  let tLabel = $derived(thresholdLabel ?? String(threshold));
  let gridLines = $derived([0.25, 0.5, 0.75, 1].map((f) => PAD.t + (1 - f) * chartH));
</script>

<div role="img" aria-label={ariaLabel} style="width:100%">
  <svg
    viewBox="0 0 {VW} {height}"
    style="width:100%;height:auto;display:block"
    aria-hidden="true"
    focusable="false"
  >
    <defs>
      <clipPath id="{uid}b">
        <rect x="0" y={threshY} width={VW} height={height - threshY} />
      </clipPath>
      <clipPath id="{uid}a">
        <rect x="0" y="0" width={VW} height={threshY} />
      </clipPath>
    </defs>
    {#each gridLines as y, i (i)}
      <line x1={PAD.l} y1={y} x2={VW - PAD.r} y2={y} stroke="rgba(255,255,255,0.06)" stroke-width="1" />
    {/each}
    <path {d} fill={belowColor} fill-opacity="0.7" clip-path="url(#{uid}b)" />
    <path {d} fill={aboveColor} fill-opacity="0.7" clip-path="url(#{uid}a)" />
    <line
      x1={PAD.l} y1={threshY}
      x2={VW - PAD.r} y2={threshY}
      stroke={aboveColor}
      stroke-width="1"
      stroke-dasharray="4 3"
      opacity="0.8"
    />
    <text
      x={VW - PAD.r - 2} y={threshY - 4}
      fill={aboveColor} font-size="9" text-anchor="end" font-family="inherit" opacity="0.9"
    >{tLabel}</text>
    {#each labels as lbl, i (i)}
      <text
        x={toX(i)} y={height - 4}
        text-anchor="middle" fill="#6E7079" font-size="9" font-family="inherit"
      >{lbl}</text>
    {/each}
  </svg>
</div>
