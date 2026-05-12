<script module lang="ts">
  export interface HexbinPoint {
    x: number;
    y: number;
  }
</script>

<script lang="ts">

  interface Props {
    points?: HexbinPoint[];
    xRange?: [number, number] | undefined;
    yRange?: [number, number] | undefined;
    height?: number;
    hexRadius?: number;
    ariaLabel?: string;
  }

  let {
    points = [],
    xRange = undefined,
    yRange = undefined,
    height = 200,
    hexRadius = 10,
    ariaLabel = 'Hexbin chart'
  }: Props = $props();

  const ROOT3 = Math.sqrt(3);
  const VW = 340;
  const PAD_L = 28;
  const PAD_R = 8;
  const PAD_T = 8;
  const PAD_B = 20;

  function pixelToHex(px: number, py: number, R: number): [number, number] {
    const q = (ROOT3 / 3 * px - 1 / 3 * py) / R;
    const r = (2 / 3 * py) / R;
    const s = -q - r;
    let rq = Math.round(q), rr = Math.round(r), rs = Math.round(s);
    const dq = Math.abs(rq - q), dr = Math.abs(rr - r), ds = Math.abs(rs - s);
    if (dq > dr && dq > ds) rq = -rr - rs;
    else if (dr > ds) rr = -rq - rs;
    else rs = -rq - rr;
    void rs;
    return [rq, rr];
  }

  function hexCenter(q: number, r: number, R: number, ox: number, oy: number): [number, number] {
    return [ROOT3 * R * (q + r / 2) + ox, 1.5 * R * r + oy];
  }

  function hexPath(cx: number, cy: number, R: number): string {
    const pts = Array.from({ length: 6 }, (_, k) => {
      const a = Math.PI / 6 + (Math.PI / 3) * k;
      return `${(cx + R * Math.cos(a)).toFixed(2)},${(cy + R * Math.sin(a)).toFixed(2)}`;
    });
    return `M${pts.join('L')}Z`;
  }

  let PLOT_W = $derived(VW - PAD_L - PAD_R);
  let PLOT_H = $derived(height - PAD_T - PAD_B);
  let xs = $derived(points.map((p) => p.x));
  let ys = $derived(points.map((p) => p.y));
  let xMin = $derived(xRange ? xRange[0] : (xs.length ? Math.min(...xs) : 0));
  let xMax = $derived(xRange ? xRange[1] : (xs.length ? Math.max(...xs) : 1));
  let yMin = $derived(yRange ? yRange[0] : (ys.length ? Math.min(...ys) : 0));
  let yMax = $derived(yRange ? yRange[1] : (ys.length ? Math.max(...ys) : 1));
  let xSpan = $derived(xMax - xMin || 1);
  let ySpan = $derived(yMax - yMin || 1);

  let bins = $derived((() => {
    const map = new Map<string, { q: number; r: number; count: number }>();
    for (const pt of points) {
      const px = ((pt.x - xMin) / xSpan) * PLOT_W;
      const py = (1 - (pt.y - yMin) / ySpan) * PLOT_H;
      const [q, r] = pixelToHex(px, py, hexRadius);
      const key = `${q},${r}`;
      const bin = map.get(key);
      if (bin) bin.count++;
      else map.set(key, { q, r, count: 1 });
    }
    return [...map.values()];
  })());

  let maxCount = $derived(bins.length ? Math.max(...bins.map((b) => b.count)) : 1);
  let yTicks = $derived([yMin, (yMin + yMax) / 2, yMax]);
  let xTicks = $derived([xMin, (xMin + xMax) / 2, xMax]);

  function ty(v: number): number { return PAD_T + (1 - (v - yMin) / ySpan) * PLOT_H; }
  function tx(v: number): number { return PAD_L + ((v - xMin) / xSpan) * PLOT_W; }
</script>

{#if points.length > 0}
  <div role="img" aria-label={ariaLabel} style="width:100%;">
    <svg viewBox="0 0 {VW} {height}" style="width:100%;height:auto;display:block;" aria-hidden="true" focusable="false">
      {#each yTicks as v, i (i)}
        <line x1={PAD_L} y1={ty(v)} x2={PAD_L + PLOT_W} y2={ty(v)} stroke="rgba(255,255,255,0.06)" stroke-width="1" />
        <text x={PAD_L - 4} y={ty(v) + 3} fill="#6E7079" font-size="8" text-anchor="end" font-family="inherit">{Math.round(v)}</text>
      {/each}

      {#each bins as { q, r, count } (`${q},${r}`)}
        {@const [cx, cy] = hexCenter(q, r, hexRadius, PAD_L, PAD_T)}
        {#if cx >= PAD_L - hexRadius * 2 && cx <= PAD_L + PLOT_W + hexRadius * 2 && cy >= PAD_T - hexRadius * 2 && cy <= PAD_T + PLOT_H + hexRadius * 2}
          {@const alpha = (0.15 + 0.85 * (count / maxCount)).toFixed(3)}
          <path d={hexPath(cx, cy, hexRadius - 0.5)} fill="rgba(0,111,255,{alpha})" stroke="rgba(0,111,255,0.2)" stroke-width="0.5" />
        {/if}
      {/each}

      {#each xTicks as v, i (i)}
        <text x={tx(v)} y={height - 4} fill="#6E7079" font-size="8" text-anchor="middle" font-family="inherit">{Math.round(v)}</text>
      {/each}
    </svg>
  </div>
{/if}
