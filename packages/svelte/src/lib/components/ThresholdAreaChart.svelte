<script context="module">
  let _n = 0;
</script>
<script lang="ts">
  const uid = `tac${_n++}`;

  export let values: number[];
  export let labels: string[] = [];
  export let threshold: number;
  export let thresholdLabel: string | undefined = undefined;
  export let belowColor: string = '#00C875';
  export let aboveColor: string = '#FF7B7B';
  export let height: number = 160;
  export let ariaLabel: string = 'Threshold area chart';

  const VW = 400;
  const PAD = { t: 16, r: 8, b: 28, l: 8 };

  $: n = values.length;
  $: chartW = VW - PAD.l - PAD.r;
  $: chartH = height - PAD.t - PAD.b;
  $: maxV = Math.max(...values, threshold, 1);
  $: toX = (i: number) => PAD.l + (n > 1 ? (i / (n - 1)) * chartW : chartW / 2);
  $: toY = (v: number) => PAD.t + chartH - (v / maxV) * chartH;
  $: threshY = toY(threshold);
  $: baseY = PAD.t + chartH;
  $: pts = values.map((v, i) => `${toX(i).toFixed(1)},${toY(v).toFixed(1)}`);
  $: d = `M ${pts.join(' L ')} L ${toX(n - 1).toFixed(1)},${baseY} L ${toX(0).toFixed(1)},${baseY} Z`;
  $: tLabel = thresholdLabel ?? String(threshold);
  $: gridLines = [0.25, 0.5, 0.75, 1].map((f) => PAD.t + (1 - f) * chartH);
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
