<script lang="ts">
  export let value: number;
  export let fillStyle: string = '';
  export let label: string | undefined = undefined;
  export let valueText: string | undefined = undefined;
  $: clamped = Math.max(0, Math.min(100, value));
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
