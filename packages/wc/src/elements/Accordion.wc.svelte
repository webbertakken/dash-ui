<svelte:options customElement="uni-accordion" />
<script>
  import Original from '@w5-ui/svelte/components/Accordion.svelte';
  let {
    /* no public props */
  } = $props();
</script>

<Original >
  <slot />
</Original>
