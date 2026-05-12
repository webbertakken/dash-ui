<svelte:options customElement="uni-filter-builder" />
<script>
  import Original from '@w5-ui/svelte/components/FilterBuilder.svelte';
  let {
    fields = [],
    value = [],
    conjunction = 'and',
    ariaLabel = 'Filter builder'
  } = $props();
</script>

<Original {fields} {value} {conjunction} {ariaLabel}>
  <slot />
</Original>
