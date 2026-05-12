<svelte:options customElement="uni-skeleton" />
<script>
  import Original from '@w5-ui/svelte/components/Skeleton.svelte';
  export let variant = 'text';
  export let width = undefined;
  export let height = undefined;
  export let ariaLabel = 'Loading';
</script>

<Original {variant} {width} {height} {ariaLabel}>
  <slot />
</Original>
