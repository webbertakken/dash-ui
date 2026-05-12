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
    showLegend = true
  }: Props = $props();
  let sum = $derived(total ?? segments.reduce((a, s) => a + s.value, 0));
  let text = $derived(ariaLabel ?? segments.map((s) => `${s.label} ${Math.round((s.value / sum) * 100)}%`).join(', '));
</script>

<div class="sp" role="img" aria-label={text}>
  <div class="sp-bar" aria-hidden="true">
    {#each segments as { label, value, color }}
      <div class="sp-seg" style="width:{((value / sum) * 100).toFixed(2)}%;background:{color}"></div>
    {/each}
  </div>
  {#if showLegend}
    <div class="sp-legend" aria-hidden="true">
      {#each segments as { label, value, color }}
        <span class="sp-item">
          <span class="sp-dot" style="background:{color}"></span>
          {label}
          <span class="sp-pct">{Math.round((value / sum) * 100)}%</span>
        </span>
      {/each}
    </div>
  {/if}
</div>
