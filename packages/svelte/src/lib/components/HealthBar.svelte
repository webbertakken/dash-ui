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
    valueText = undefined
  }: Props = $props();
  let clamped = $derived(Math.max(0, Math.min(100, value)));
</script>

<div
  class="hb"
  role="progressbar"
  aria-valuenow={Math.round(clamped)}
  aria-valuemin={0}
  aria-valuemax={100}
  aria-label={label}
  aria-valuetext={valueText}
>
  <div class="hb-fill" style="width:{clamped}%; {fillStyle}"></div>
</div>
