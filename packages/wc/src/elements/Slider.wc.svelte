<svelte:options customElement="uni-slider" />
<script>
  import Original from '@w5-ui/svelte/components/Slider.svelte';
  let {
    label = undefined,
    value = 0,
    min = 0,
    max = 100,
    step = 1,
    suffix = undefined,
    disabled = false,
    id = undefined
  } = $props();
</script>

<Original {label} {value} {min} {max} {step} {suffix} {disabled} {id}>
  <slot />
</Original>
