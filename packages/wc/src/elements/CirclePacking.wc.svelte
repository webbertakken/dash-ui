<svelte:options tag="uni-circle-packing" />
<script>
  import Original from '@dash-ui/svelte/components/CirclePacking.svelte';
  export let items = undefined;
  export let height = 200;
  export let ariaLabel = 'Circle packing chart';
</script>

<Original {items} {height} {ariaLabel}>
  <slot />
</Original>
