<script lang="ts">
  export interface BumpSeries {
    label: string;
    ranks: number[];
    color?: string;
  }

  export let labels: string[] = [];
  export let series: BumpSeries[] = [];
  export let ariaLabel: string = 'Bump chart';

  const VW = 380;
  const PAD_L = 12;
  const PAD_R = 76;
  const PAD_T = 8;
  const PAD_B = 20;
  const ROW_H = 28;
  const DOT_R = 5;
  const COLORS = ['#006FFF', '#00C8C8', '#F5A623', '#7FB6FF', '#A878F5', '#F56342'];

  $: maxRank = Math.max(...series.flatMap((s) => s.ranks), 1);
  $: TRACK_W = VW - PAD_L - PAD_R;
  $: svgH = PAD_T + maxRank * ROW_H + PAD_B;
  $: rankRows = Array.from({ length: maxRank }, (_, i) => i);

  function xOf(i: number): number {
    return labels.length > 1
      ? PAD_L + (i / (labels.length - 1)) * TRACK_W
      : PAD_L + TRACK_W / 2;
  }

  function yOf(rank: number): number {
    return PAD_T + (rank - 1) * ROW_H + ROW_H / 2;
  }

  function buildPath(ranks: number[]): string {
    return ranks
      .map((rank, i) => {
        const x = xOf(i);
        const y = yOf(rank);
        if (i === 0) return `M${x},${y}`;
        const prevX = xOf(i - 1);
        const prevY = yOf(ranks[i - 1]);
        const cpX = (prevX + x) / 2;
        return `C${cpX},${prevY} ${cpX},${y} ${x},${y}`;
      })
      .join(' ');
  }
</script>

<div role="img" aria-label={ariaLabel} style="width:100%;">
  <svg
    viewBox="0 0 {VW} {svgH}"
    style="width:100%;height:auto;display:block;"
    aria-hidden="true"
    focusable="false"
  >
    {#each labels as label, i (i)}
      <g>
        <line
          x1={xOf(i)} y1={PAD_T}
          x2={xOf(i)} y2={PAD_T + maxRank * ROW_H}
          stroke="rgba(255,255,255,0.06)" stroke-width="1"
        />
        <text
          x={xOf(i)} y={svgH - 5}
          fill="#6E7079" font-size="9" text-anchor="middle" font-family="inherit"
        >{label}</text>
      </g>
    {/each}

    {#each rankRows as r (r)}
      <line
        x1={PAD_L} y1={yOf(r + 1)}
        x2={PAD_L + TRACK_W} y2={yOf(r + 1)}
        stroke="rgba(255,255,255,0.04)" stroke-width="1"
      />
    {/each}

    {#each series as s, si (si)}
      {@const color = s.color ?? COLORS[si % COLORS.length]}
      {@const lastRank = s.ranks[s.ranks.length - 1]}
      <g>
        <path
          d={buildPath(s.ranks)}
          fill="none"
          stroke={color}
          stroke-width="2.5"
          opacity="0.85"
        />
        {#each s.ranks as rank, i (i)}
          <circle
            cx={xOf(i)} cy={yOf(rank)} r={DOT_R}
            fill={color}
            stroke="#1A1F2E"
            stroke-width="1.5"
          />
        {/each}
        <text
          x={xOf(labels.length - 1) + DOT_R + 6}
          y={yOf(lastRank) + 4}
          fill={color}
          font-size="10"
          font-family="inherit"
        >{s.label}</text>
      </g>
    {/each}
  </svg>
</div>
