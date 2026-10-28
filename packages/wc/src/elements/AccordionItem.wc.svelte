<svelte:options customElement={{ tag: "uni-accordion-item", extend: withShadowStyles }} />
<script>
  import Original from '@w5-ui/svelte/components/AccordionItem.svelte';
  import { withShadowStyles } from '../styled.ts';
  let {
    title = undefined,
    defaultOpen = false
  } = $props();
</script>

<Original {title} {defaultOpen}>
  <slot />
</Original>
