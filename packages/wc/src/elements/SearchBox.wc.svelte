<svelte:options customElement={{ tag: "uni-search-box", extend: withShadowStyles }} />
<script>
  import Original from '@w5-ui/svelte/components/SearchBox.svelte';
  import { withShadowStyles } from '../styled.ts';
  let {
    placeholder = '',
    value = '',
    ariaLabel = ''
  } = $props();
</script>

<Original {placeholder} {value} {ariaLabel}>
  <slot />
</Original>
