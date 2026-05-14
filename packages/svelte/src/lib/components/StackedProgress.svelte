<script module lang="ts">
  export interface StackedProgressSegment {
    label: string;
    value: number;
    color: string;
  }
</script>

<script lang="ts">
  interface Props {
    segments: StackedProgressSegment[];
    total?: number | undefined;
    ariaLabel?: string | undefined;
    showLegend?: boolean;
  }

  let {
    segments,
    total = undefined,
    ariaLabel = undefined,
    showLegend = true,
  }: Props = $props();
  let sum = $derived(total ?? segments.reduce((a, s) => a + s.value, 0));
  let text = $derived(
    ariaLabel ?? segments.map((s) => `${s.label} ${Math.round((s.value / sum) * 100)}%`).join(', '),
  );
</script>

<div class="flex w-full flex-col gap-2" role="img" aria-label={text}>
  <div
    class="flex h-2 w-full overflow-hidden rounded-sm bg-white/[0.06]"
    aria-hidden="true"
  >
    {#each segments as { label, value, color }}
      <div
        class="h-full first:rounded-l-sm last:rounded-r-sm"
        style="width:{((value / sum) * 100).toFixed(2)}%;background:{color}"
      ></div>
    {/each}
  </div>
  {#if showLegend}
    <div class="flex flex-wrap items-center gap-3" aria-hidden="true">
      {#each segments as { label, value, color }}
        <span class="inline-flex items-center gap-1.5 text-12 text-[#c8c9d0]">
          <span class="inline-block h-2 w-2 shrink-0 rounded-full" style="background:{color}"></span>
          {label}
          <span class="text-[#6e7079] tabular-nums">{Math.round((value / sum) * 100)}%</span>
        </span>
      {/each}
    </div>
  {/if}
</div>
