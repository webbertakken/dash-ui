<svelte:options customElement="uni-tabs" />
<script>
  import Original from '@w5-ui/svelte/components/Tabs.svelte';
  let {
    items = [],
    active = undefined,
    ariaLabel = undefined
  } = $props();
</script>

<Original {items} {active} {ariaLabel}>
  <slot />
</Original>
