<script context="module" lang="ts">
  export interface StackedProgressSegment {
    label: string;
    value: number;
    color: string;
  }
</script>

<script lang="ts">
  export let segments: StackedProgressSegment[];
  export let total: number | undefined = undefined;
  export let ariaLabel: string | undefined = undefined;
  export let showLegend: boolean = true;
  $: sum = total ?? segments.reduce((a, s) => a + s.value, 0);
  $: text = ariaLabel ?? segments.map((s) => `${s.label} ${Math.round((s.value / sum) * 100)}%`).join(', ');
</script>

<div class="sp" role="img" aria-label={text}>
  <div class="sp-bar" aria-hidden="true">
    {#each segments as { label, value, color }}
      <div class="sp-seg" style="width:{((value / sum) * 100).toFixed(2)}%;background:{color}" />
    {/each}
  </div>
  {#if showLegend}
    <div class="sp-legend" aria-hidden="true">
      {#each segments as { label, value, color }}
        <span class="sp-item">
          <span class="sp-dot" style="background:{color}" />
          {label}
          <span class="sp-pct">{Math.round((value / sum) * 100)}%</span>
        </span>
      {/each}
    </div>
  {/if}
</div>
