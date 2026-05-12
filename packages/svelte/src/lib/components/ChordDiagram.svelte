<script context="module" lang="ts">
  export interface ChordNode { label: string; color?: string; }
</script>

<script lang="ts">

  export let nodes: ChordNode[];
  export let matrix: number[][];
  export let ariaLabel: string = 'Chord diagram';

  const PALETTE = ['#006FFF', '#00C875', '#A78BFA', '#F5A623', '#50B8E7', '#F04949'];
  const CX = 160, CY = 160, R_IN = 108, R_ARC = 125, R_LBL = 138, PAD = 0.04;

  function pt(r: number, a: number) {
    return `${(CX + r * Math.cos(a)).toFixed(1)},${(CY + r * Math.sin(a)).toFixed(1)}`;
  }

  function arcSlice(r1: number, r2: number, a1: number, a2: number) {
    const lg = a2 - a1 > Math.PI ? 1 : 0;
    return `M${pt(r2, a1)} A${r2},${r2} 0 ${lg},1 ${pt(r2, a2)} L${pt(r1, a2)} A${r1},${r1} 0 ${lg},0 ${pt(r1, a1)} Z`;
  }

  function ribbon(a1: number, a2: number, b1: number, b2: number) {
    const la = +(a2 - a1 > Math.PI);
    const lb = +(b2 - b1 > Math.PI);
    return `M${pt(R_IN, a1)} A${R_IN},${R_IN} 0 ${la},1 ${pt(R_IN, a2)} Q${CX},${CY} ${pt(R_IN, b2)} A${R_IN},${R_IN} 0 ${lb},0 ${pt(R_IN, b1)} Q${CX},${CY} ${pt(R_IN, a1)}Z`;
  }

  type Arc = { d: string; fill: string };
  type Chord = { d: string; fill: string };
  type Label = { x: number; y: number; anchor: string; text: string };

  $: ({ arcs, chords, labels } = (() => {
    const n = nodes.length;
    const totals = nodes.map((_, i) => matrix[i].reduce((s, v) => s + v, 0));
    const grand = totals.reduce((s, v) => s + v, 0);
    if (!grand) return { arcs: [] as Arc[], chords: [] as Chord[], labels: [] as Label[] };

    const scale = (2 * Math.PI - PAD * n) / grand;
    const nodeA: { start: number; end: number; offsets: number[] }[] = [];
    let angle = -Math.PI / 2;

    for (let i = 0; i < n; i++) {
      const span = totals[i] * scale;
      const offsets: number[] = [];
      let off = angle;
      for (let j = 0; j < n; j++) {
        offsets.push(off);
        off += matrix[i][j] * scale;
      }
      nodeA.push({ start: angle, end: angle + span, offsets });
      angle += span + PAD;
    }

    const arcs: Arc[] = nodeA.map((a, i) => ({
      d: arcSlice(R_IN + 2, R_ARC, a.start, a.end),
      fill: nodes[i].color ?? PALETTE[i % PALETTE.length],
    }));

    const chords: Chord[] = [];
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        const vij = matrix[i][j], vji = matrix[j][i];
        if (!vij && !vji) continue;
        const a1 = nodeA[i].offsets[j], a2 = a1 + vij * scale;
        const b1 = nodeA[j].offsets[i], b2 = b1 + vji * scale;
        chords.push({ d: ribbon(a1, a2, b1, b2), fill: (nodes[i].color ?? PALETTE[i % PALETTE.length]) + '55' });
      }
    }

    const labels: Label[] = nodeA.map((a, i) => {
      const mid = (a.start + a.end) / 2;
      const anchor = Math.cos(mid) > 0.2 ? 'start' : Math.cos(mid) < -0.2 ? 'end' : 'middle';
      return { x: CX + R_LBL * Math.cos(mid), y: CY + R_LBL * Math.sin(mid) + 4, anchor, text: nodes[i].label };
    });

    return { arcs, chords, labels };
  })());
</script>

<div role="img" aria-label={ariaLabel} style="width:100%;">
  <svg viewBox="0 0 320 320" style="width:100%;height:auto;display:block;" aria-hidden="true" focusable="false">
    {#each chords as c, i (i)}
      <path d={c.d} fill={c.fill} />
    {/each}
    {#each arcs as a, i (i)}
      <path d={a.d} fill={a.fill} />
    {/each}
    {#each labels as l, i (i)}
      <text x={l.x.toFixed(1)} y={l.y.toFixed(1)} text-anchor={l.anchor} fill="#fff" font-size="10" font-weight="600" font-family="inherit">{l.text}</text>
    {/each}
  </svg>
</div>
