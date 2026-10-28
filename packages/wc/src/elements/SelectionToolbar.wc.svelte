<svelte:options customElement={{ tag: "uni-selection-toolbar", extend: withShadowStyles }} />
<script>
  import Original from '@w5-ui/svelte/components/SelectionToolbar.svelte';
  import { withShadowStyles } from '../styled.ts';
  let {
    count = undefined,
    actions = [],
    ariaLabel = 'Selection actions'
  } = $props();
</script>

<Original {count} {actions} {ariaLabel}>
  <slot />
</Original>
