<svelte:options customElement="uni-search-box" />
<script>
  import Original from '@w5-ui/svelte/components/SearchBox.svelte';
  let {
    placeholder = '',
    value = '',
    ariaLabel = ''
  } = $props();
</script>

<Original {placeholder} {value} {ariaLabel}>
  <slot />
</Original>
