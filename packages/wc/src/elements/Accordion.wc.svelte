<svelte:options customElement={{ tag: "uni-accordion", extend: withShadowStyles }} />
<script>
  import Original from '@w5-ui/svelte/components/Accordion.svelte';
  import { withShadowStyles } from '../styled.ts';
  let {
    /* no public props */
  } = $props();
</script>

<Original >
  <slot />
</Original>
