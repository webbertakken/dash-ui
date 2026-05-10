<script lang="ts">
  export let value: number;
  export let label: string | undefined = undefined;
  export let valueText: string | undefined = undefined;
  export let color: string = '#006FFF';
  $: clamped = Math.max(0, Math.min(100, value));
  $: displayed = valueText ?? `${Math.round(clamped)}%`;
  $: hasHeader = label !== undefined || valueText !== undefined;
</script>

<div class="pb">
  {#if hasHeader}
    <div class="pb-header">
      {#if label}<span class="pb-label">{label}</span>{/if}
      <span class="pb-value">{displayed}</span>
    </div>
  {/if}
  <div
    class="pb-track"
    role="progressbar"
    aria-valuenow={Math.round(clamped)}
    aria-valuemin={0}
    aria-valuemax={100}
    aria-label={label}
    aria-valuetext={displayed}
  >
    <div class="pb-fill" style="width:{clamped}%;background:{color};" />
  </div>
</div>
