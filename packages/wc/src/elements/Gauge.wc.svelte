<svelte:options tag="uni-gauge" />
<script>
  import Original from '@w5-ui/svelte/components/Gauge.svelte';
  export let value = 0;
  export let label = '';
  export let color = '#006FFF';
  export let size = 120;
  export let ariaLabel = undefined;
</script>

<Original {value} {label} {color} {size} {ariaLabel}>
  <slot />
</Original>
