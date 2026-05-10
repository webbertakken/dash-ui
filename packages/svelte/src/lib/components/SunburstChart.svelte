<script lang="ts">
  export interface SunburstNode {
    label: string;
    value?: number;
    color?: string;
    children?: SunburstNode[];
  }

  export let root: SunburstNode;
  export let ariaLabel: string = 'Sunburst chart';

  const PALETTE = ['#006FFF', '#00C875', '#A78BFA', '#F5A623', '#50B8E7', '#F04949'];
  const CX = 160, CY = 160, R_HOLE = 48, R_MID = 97, R_OUTER = 142, GAP = 0.01;

  function arcPath(r1: number, r2: number, a1: number, a2: number): string {
    const lg = a2 - a1 > Math.PI ? 1 : 0;
    const p = (r: number, a: number) => `${(CX + r * Math.cos(a)).toFixed(1)},${(CY + r * Math.sin(a)).toFixed(1)}`;
    return `M${p(r2, a1)} A${r2},${r2} 0 ${lg},1 ${p(r2, a2)} L${p(r1, a2)} A${r1},${r1} 0 ${lg},0 ${p(r1, a1)} Z`;
  }

  type PathData = { d: string; fill: string };
  type LabelData = { x: number; y: number; anchor: string; text: string };

  $: ({ paths, labels, total } = (() => {
    const items = root.children ?? [];
    const total = items.reduce((s, c) => s + (c.value ?? c.children?.reduce((cs, x) => cs + (x.value ?? 0), 0) ?? 0), 0);
    if (!total) return { paths: [] as PathData[], labels: [] as LabelData[], total: 0 };

    const paths: PathData[] = [];
    const labels: LabelData[] = [];
    let a = -Math.PI / 2;

    for (let i = 0; i < items.length; i++) {
      const c = items[i];
      const fill = c.color ?? PALETTE[i % PALETTE.length];
      const cv = c.value ?? c.children?.reduce((s, x) => s + (x.value ?? 0), 0) ?? 0;
      const span = (cv / total) * 2 * Math.PI;
      const a2 = a + span;
      const midA = (a + a2) / 2;

      paths.push({ d: arcPath(R_MID + 2, R_OUTER, a + GAP, a2 - GAP), fill });

      if (span > 0.22) {
        const r = (R_MID + 2 + R_OUTER) / 2;
        const anchor = Math.cos(midA) > 0.15 ? 'start' : Math.cos(midA) < -0.15 ? 'end' : 'middle';
        labels.push({ x: CX + r * Math.cos(midA), y: CY + r * Math.sin(midA) + 4, anchor, text: c.label });
      }

      if (c.children?.length) {
        let ca = a;
        for (const child of c.children) {
          const cs = ((child.value ?? 0) / cv) * span;
          if (cs > GAP * 2) paths.push({ d: arcPath(R_HOLE, R_MID - 2, ca + GAP, ca + cs - GAP), fill: fill + '99' });
          ca += cs;
        }
      } else {
        paths.push({ d: arcPath(R_HOLE, R_MID - 2, a + GAP, a2 - GAP), fill: fill + '99' });
      }

      a = a2;
    }

    return { paths, labels, total };
  })());

  const fmt = (n: number) => n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);
</script>

<div role="img" aria-label={ariaLabel} style="width:100%;">
  <svg viewBox="0 0 320 320" style="width:100%;height:auto;display:block;" aria-hidden="true" focusable="false">
    {#each paths as p, i (i)}
      <path d={p.d} fill={p.fill} />
    {/each}
    {#each labels as l, i (i)}
      <text x={l.x.toFixed(1)} y={l.y.toFixed(1)} text-anchor={l.anchor} fill="#fff" font-size="10" font-weight="600" font-family="inherit">{l.text}</text>
    {/each}
    <text x={CX} y={CY - 8} text-anchor="middle" fill="#fff" font-size="22" font-weight="700" font-family="inherit">{fmt(total)}</text>
    <text x={CX} y={CY + 12} text-anchor="middle" fill="#6E7079" font-size="10" font-family="inherit">{root.label}</text>
  </svg>
</div>
