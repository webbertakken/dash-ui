<svelte:options tag="uni-skeleton" />
<script>
  import Original from '@dash-ui/svelte/components/Skeleton.svelte';
  export let variant = 'text';
  export let width = undefined;
  export let height = undefined;
  export let ariaLabel = 'Loading';
</script>

<Original {variant} {width} {height} {ariaLabel}>
  <slot />
</Original>
