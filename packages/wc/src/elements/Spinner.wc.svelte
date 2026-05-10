<svelte:options tag="uni-spinner" />
<script>
  import Original from '@dash-ui/svelte/components/Spinner.svelte';
  export let size = 'md';
  export let label = 'Loading';
</script>

<Original {size} {label}>
  <slot />
</Original>
