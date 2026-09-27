<svelte:options customElement={{ tag: "uni-tabs", extend: withShadowStyles }} />
<script>
  import Original from '@w5-ui/svelte/components/Tabs.svelte';
  import { withShadowStyles } from '../styled.ts';
  let {
    items = [],
    active = undefined,
    ariaLabel = undefined
  } = $props();
</script>

<Original {items} {active} {ariaLabel}>
  <slot />
</Original>
