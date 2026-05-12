<svelte:options customElement="uni-spinner" />
<script>
  import Original from '@w5-ui/svelte/components/Spinner.svelte';
  let {
    size = 'md',
    label = 'Loading'
  } = $props();
</script>

<Original {size} {label}>
  <slot />
</Original>
