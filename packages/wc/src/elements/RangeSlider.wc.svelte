<svelte:options customElement="uni-range-slider" />
<script>
  import Original from '@w5-ui/svelte/components/RangeSlider.svelte';
  let {
    label = undefined,
    min = 0,
    max = 100,
    step = 1,
    low = 0,
    high = 100,
    suffix = undefined,
    disabled = false
  } = $props();
</script>

<Original {label} {min} {max} {step} {low} {high} {suffix} {disabled}>
  <slot />
</Original>
