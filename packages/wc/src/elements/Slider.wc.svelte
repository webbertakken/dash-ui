<svelte:options tag="uni-slider" />
<script>
  import Original from '@w5-ui/svelte/components/Slider.svelte';
  export let label = undefined;
  export let value = 0;
  export let min = 0;
  export let max = 100;
  export let step = 1;
  export let suffix = undefined;
  export let disabled = false;
  export let id = undefined;
</script>

<Original {label} {value} {min} {max} {step} {suffix} {disabled} {id}>
  <slot />
</Original>
