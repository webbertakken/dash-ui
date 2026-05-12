<script lang="ts">
  interface Props {
    value: number;
    label?: string | undefined;
    valueText?: string | undefined;
    color?: string;
  }

  let {
    value,
    label = undefined,
    valueText = undefined,
    color = '#006FFF'
  }: Props = $props();
  let clamped = $derived(Math.max(0, Math.min(100, value)));
  let displayed = $derived(valueText ?? `${Math.round(clamped)}%`);
  let hasHeader = $derived(label !== undefined || valueText !== undefined);
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
    <div class="pb-fill" style="width:{clamped}%;background:{color};"></div>
  </div>
</div>
