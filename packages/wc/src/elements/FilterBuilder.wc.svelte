<svelte:options customElement={{ tag: "uni-filter-builder", extend: withShadowStyles }} />
<script>
  import Original from '@w5-ui/svelte/components/FilterBuilder.svelte';
  import { withShadowStyles } from '../styled.ts';
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
