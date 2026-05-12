<svelte:options customElement="uni-tab-panel" />
<script>
  import Original from '@w5-ui/svelte/components/TabPanel.svelte';
  let {
    id = undefined,
    active = undefined
  } = $props();
</script>

<Original {id} {active}>
  <slot />
</Original>
