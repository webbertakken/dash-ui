<script lang="ts">
  export interface VennSet {
    id: string;
    label: string;
    value: number;
    color?: string;
  }
  export interface VennIntersection {
    sets: string[];
    value: number;
  }

  export let sets: VennSet[] = [];
  export let intersections: VennIntersection[] = [];
  export let height = 240;
  export let ariaLabel = 'Venn diagram';

  const PALETTE = ['#006FFF', '#00C875', '#A78BFA'];
  const VW = 340;

  function fmt(n: number): string {
    return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);
  }

  $: valid = sets.length >= 2 && sets.length <= 3;
  $: is3 = sets.length === 3;
  $: cx = VW / 2;
  $: cy = height / 2;

  $: circles = is3
    ? [
        { x: cx,      y: cy - 40, r: 75 },
        { x: cx - 65, y: cy + 50, r: 75 },
        { x: cx + 65, y: cy + 50, r: 75 },
      ]
    : [
        { x: cx - 58, y: cy, r: 85 },
        { x: cx + 58, y: cy, r: 85 },
      ];

  $: exclusiveValues = sets.map((s) =>
    Math.max(
      0,
      s.value -
        intersections
          .filter((i) => i.sets.includes(s.id))
          .reduce((sum, i) => sum + i.value, 0),
    ),
  );

  function getPt(inter: VennIntersection): { x: number; y: number } | null {
    const idxById: Record<string, number> = {};
    sets.forEach((s, i) => { idxById[s.id] = i; });
    const idxs = inter.sets
      .map((id) => idxById[id])
      .filter((v) => v !== undefined)
      .sort((a, b) => a - b);
    if (!is3) return { x: cx, y: cy };
    if (idxs.length >= 3) return { x: cx, y: cy + 18 };
    if (idxs[0] === 0 && idxs[1] === 1) return { x: cx - 33, y: cy + 4 };
    if (idxs[0] === 0 && idxs[1] === 2) return { x: cx + 33, y: cy + 4 };
    if (idxs[0] === 1 && idxs[1] === 2) return { x: cx, y: cy + 50 };
    return null;
  }
</script>

{#if valid}
  <div role="img" aria-label={ariaLabel} style="width:100%;">
    <svg viewBox="0 0 {VW} {height}" style="width:100%;height:auto;display:block;" aria-hidden="true" focusable="false">
      {#each sets as s, i}
        {@const c = circles[i]}
        {@const color = s.color ?? PALETTE[i % PALETTE.length]}
        <circle cx={c.x} cy={c.y} r={c.r} fill={color} fill-opacity="0.15" stroke={color} stroke-opacity="0.55" stroke-width="1.5" />
      {/each}

      {#each sets as s, i}
        {@const c = circles[i]}
        {@const color = s.color ?? PALETTE[i % PALETTE.length]}
        <text x={c.x} y={c.y - 8} fill={color} font-size="11" text-anchor="middle" font-family="inherit" font-weight="600">{s.label}</text>
        <text x={c.x} y={c.y + 8} fill="#A4A7B5" font-size="10" text-anchor="middle" font-family="inherit">{fmt(exclusiveValues[i])}</text>
      {/each}

      {#each intersections as inter}
        {@const pt = getPt(inter)}
        {#if pt}
          <text x={pt.x} y={pt.y} fill="rgba(255,255,255,0.65)" font-size="10" text-anchor="middle" font-family="inherit">{fmt(inter.value)}</text>
        {/if}
      {/each}
    </svg>
  </div>
{/if}
