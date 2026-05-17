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
    color = '#006FFF',
  }: Props = $props();
  let clamped = $derived(Math.max(0, Math.min(100, value)));
  let displayed = $derived(valueText ?? `${Math.round(clamped)}%`);
  let hasHeader = $derived(label !== undefined || valueText !== undefined);
</script>

<div class="flex flex-col gap-1">
  {#if hasHeader}
    <div class="flex justify-between text-12">
      {#if label}<span class="text-text-2">{label}</span>{/if}
      <span class="font-mono text-text-3">{displayed}</span>
    </div>
  {/if}
  <div
    class="h-1.5 overflow-hidden rounded-[3px] bg-row-active"
    role="progressbar"
    aria-valuenow={Math.round(clamped)}
    aria-valuemin={0}
    aria-valuemax={100}
    aria-label={label}
    aria-valuetext={displayed}
  >
    <div
      class="h-full rounded-[3px] transition-[width] duration-300 ease-out motion-reduce:transition-none"
      style="width:{clamped}%;background:{color};"
    ></div>
  </div>
</div>
