<script lang="ts">
  export interface CalendarDay {
    date: string;
    value: number;
  }

  export let data: CalendarDay[] = [];
  export let maxValue: number | undefined = undefined;
  export let ariaLabel: string = 'Calendar heatmap';

  const CELL = 10;
  const GAP = 2;
  const STEP = CELL + GAP;
  const WEEKS = 52;
  const DAYS = 7;
  const LEFT = 22;
  const TOP = 16;
  const COLORS = ['rgba(255,255,255,0.06)', '#0d2a5e', '#1a4da6', '#2979ff', '#5ba4ff'];
  const DAY_LABELS = ['Mon', '', 'Wed', '', 'Fri', '', ''];
  const W = LEFT + WEEKS * STEP;
  const H = TOP + DAYS * STEP + 2;

  function lvl(v: number, mx: number): number {
    if (!v) return 0;
    const r = v / mx;
    return r < 0.25 ? 1 : r < 0.5 ? 2 : r < 0.75 ? 3 : 4;
  }

  function toDateStr(d: Date): string {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }

  $: ({ cells, monthLabels } = (() => {
    const byDate = new Map(data.map((d) => [d.date, d.value]));
    const mx = maxValue ?? Math.max(1, ...data.map((d) => d.value));

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const start = new Date(today);
    start.setDate(start.getDate() - WEEKS * 7 + 1);
    start.setDate(start.getDate() - start.getDay());

    const cells: { x: number; y: number; fill: string }[] = [];
    const seenMonths = new Set<string>();
    const monthLabels: { x: number; label: string }[] = [];

    for (let w = 0; w < WEEKS; w++) {
      for (let d = 0; d < DAYS; d++) {
        const date = new Date(start);
        date.setDate(start.getDate() + w * 7 + d);
        const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
        if (!seenMonths.has(monthKey) && d === 0) {
          seenMonths.add(monthKey);
          monthLabels.push({ x: LEFT + w * STEP, label: date.toLocaleString('en', { month: 'short' }) });
        }
        const val = byDate.get(toDateStr(date)) ?? 0;
        cells.push({ x: LEFT + w * STEP, y: TOP + d * STEP, fill: COLORS[lvl(val, mx)] });
      }
    }

    return { cells, monthLabels };
  })());
</script>

<div role="img" aria-label={ariaLabel} style="width:100%;overflow-x:auto;">
  <svg viewBox="0 0 {W} {H}" style="width:100%;height:auto;display:block;" aria-hidden="true" focusable="false">
    {#each DAY_LABELS as label, d}
      {#if label}
        <text
          x={LEFT - 3}
          y={TOP + d * STEP + CELL * 0.8}
          text-anchor="end"
          fill="#6E7079"
          font-size="7"
          font-family="inherit"
        >{label}</text>
      {/if}
    {/each}
    {#each monthLabels as m}
      <text x={m.x} y={TOP - 3} fill="#6E7079" font-size="7" font-family="inherit">{m.label}</text>
    {/each}
    {#each cells as c, i (i)}
      <rect x={c.x} y={c.y} width={CELL} height={CELL} rx="2" fill={c.fill} />
    {/each}
  </svg>
</div>
