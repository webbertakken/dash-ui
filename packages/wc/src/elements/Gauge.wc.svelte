<svelte:options customElement="uni-gauge" />
<script>
  import Original from '@w5-ui/svelte/components/Gauge.svelte';
  let {
    value = 0,
    label = '',
    color = '#006FFF',
    size = 120,
    ariaLabel = undefined
  } = $props();
</script>

<Original {value} {label} {color} {size} {ariaLabel}>
  <slot />
</Original>
