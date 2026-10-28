<svelte:options customElement={{ tag: "uni-tab-panel", extend: withShadowStyles }} />
<script>
  import Original from '@w5-ui/svelte/components/TabPanel.svelte';
  import { withShadowStyles } from '../styled.ts';
  let {
    id = undefined,
    active = undefined
  } = $props();
</script>

<Original {id} {active}>
  <slot />
</Original>
