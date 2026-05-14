<script lang="ts">
  interface Props {
    value: number;
    fillStyle?: string;
    label?: string | undefined;
    valueText?: string | undefined;
  }

  let {
    value,
    fillStyle = '',
    label = undefined,
    valueText = undefined,
  }: Props = $props();
  let clamped = $derived(Math.max(0, Math.min(100, value)));
</script>

<div
  class="h-1 overflow-hidden rounded-sm bg-white/[0.06]"
  role="progressbar"
  aria-valuenow={Math.round(clamped)}
  aria-valuemin={0}
  aria-valuemax={100}
  aria-label={label}
  aria-valuetext={valueText}
>
  <div
    class="h-full bg-gradient-to-r from-brand-05 to-brand-06"
    style="width:{clamped}%; {fillStyle}"
  ></div>
</div>
