<svelte:options customElement={{ tag: "uni-app-layout", extend: withShadowStyles }} />
<script>
  import Original from '@w5-ui/svelte/components/AppLayout.svelte';
  import { withShadowStyles } from '../styled.ts';
  let {
    pageLabel = undefined,
    class: className = ''
  } = $props();
</script>

<Original {pageLabel} class={className}>
  <slot />
</Original>
