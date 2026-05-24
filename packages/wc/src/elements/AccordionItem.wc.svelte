<svelte:options customElement="uni-accordion-item" />
<script>
  import Original from '@w5-ui/svelte/components/AccordionItem.svelte';
  let {
    title = undefined,
    defaultOpen = false
  } = $props();
</script>

<Original {title} {defaultOpen}>
  <slot />
</Original>
