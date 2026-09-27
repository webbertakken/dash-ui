<svelte:options customElement={{ tag: "uni-sidebar", extend: withShadowStyles }} />
<script>
  import Original from '@w5-ui/svelte/components/Sidebar.svelte';
  import { withShadowStyles } from '../styled.ts';
  let {
    sections = [],
    activeId = undefined
  } = $props();
</script>

<Original {sections} {activeId}>
  <slot />
</Original>
