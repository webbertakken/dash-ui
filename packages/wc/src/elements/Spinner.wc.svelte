<svelte:options customElement="uni-spinner" />
<script>
  import Original from '@w5-ui/svelte/components/Spinner.svelte';
  export let size = 'md';
  export let label = 'Loading';
</script>

<Original {size} {label}>
  <slot />
</Original>
