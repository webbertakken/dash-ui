<svelte:options customElement="uni-search-box" />
<script>
  import Original from '@w5-ui/svelte/components/SearchBox.svelte';
  export let placeholder = '';
  export let value = '';
  export let ariaLabel = '';
</script>

<Original {placeholder} {value} {ariaLabel}>
  <slot />
</Original>
