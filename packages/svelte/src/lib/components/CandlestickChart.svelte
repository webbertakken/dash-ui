<script module lang="ts">
  export interface CandlestickBar {
    label: string;
    open: number;
    close: number;
    high: number;
    low: number;
  }
</script>

<script lang="ts">

  interface Props {
    bars?: CandlestickBar[];
    yRange?: [number, number] | undefined;
    height?: number;
    unit?: string;
    upColor?: string;
    downColor?: string;
    ariaLabel?: string;
  }

  let {
    bars = [],
    yRange = undefined,
    height = 180,
    unit = '',
    upColor = '#00C875',
    downColor = '#FF7B7B',
    ariaLabel = 'Candlestick chart'
  }: Props = $props();

  const VW = 340;
  const PAD_L = 28;
  const PAD_R = 8;
  const PAD_T = 8;
  const PAD_B = 20;
  const PLOT_W = VW - PAD_L - PAD_R;

  let n = $derived(bars.length);
  let PLOT_H = $derived(height - PAD_T - PAD_B);
  let allVals = $derived(bars.flatMap((b) => [b.low, b.high]));
  let minV = $derived(yRange ? yRange[0] : allVals.length ? Math.min(...allVals) : 0);
  let maxV = $derived(yRange ? yRange[1] : allVals.length ? Math.max(...allVals) : 1);
  let vRange = $derived(maxV - minV || 1);
  let yTicks = $derived([minV, (minV + maxV) / 2, maxV]);
  let candleW = $derived(Math.max(4, (PLOT_W / (n || 1)) * 0.5));

  function tx(i: number): number {
    return PAD_L + ((i + 0.5) / (n || 1)) * PLOT_W;
  }

  function ty(v: number): number {
    return PAD_T + (1 - (v - minV) / vRange) * PLOT_H;
  }
</script>

{#if bars.length > 0}
  <div role="img" aria-label={ariaLabel} style="width:100%;">
    <svg viewBox="0 0 {VW} {height}" style="width:100%;height:auto;display:block;" aria-hidden="true" focusable="false">
      {#each yTicks as v, i (i)}
        <line x1={PAD_L} y1={ty(v)} x2={PAD_L + PLOT_W} y2={ty(v)} stroke="rgba(255,255,255,0.06)" stroke-width="1" />
        <text x={PAD_L - 4} y={ty(v) + 4} fill="#6E7079" font-size="8" text-anchor="end" font-family="inherit">{Math.round(v)}{unit}</text>
      {/each}

      {#each bars as b, i (i)}
        {@const x = tx(i)}
        {@const color = b.close >= b.open ? upColor : downColor}
        {@const bodyTop = ty(Math.max(b.open, b.close))}
        {@const bodyBot = ty(Math.min(b.open, b.close))}
        {@const bodyH = Math.max(1, bodyBot - bodyTop)}
        <line x1={x} y1={ty(b.high)} x2={x} y2={ty(b.low)} stroke={color} stroke-width="1" />
        <rect x={x - candleW / 2} y={bodyTop} width={candleW} height={bodyH} fill={color} />
      {/each}

      {#each bars as b, i (i)}
        <text x={tx(i)} y={height - 4} fill="#6E7079" font-size="9" text-anchor="middle" font-family="inherit">{b.label}</text>
      {/each}
    </svg>
  </div>
{/if}
