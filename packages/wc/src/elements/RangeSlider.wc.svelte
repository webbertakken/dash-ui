<svelte:options tag="uni-range-slider" />
<script>
  import Original from '@w5-ui/svelte/components/RangeSlider.svelte';
  export let label = undefined;
  export let min = 0;
  export let max = 100;
  export let step = 1;
  export let low = 0;
  export let high = 100;
  export let suffix = undefined;
  export let disabled = false;
</script>

<Original {label} {min} {max} {step} {low} {high} {suffix} {disabled}>
  <slot />
</Original>
