<svelte:options tag="uni-tab-panel" />
<script>
  import Original from '@w5-ui/svelte/components/TabPanel.svelte';
  export let id = undefined;
  export let active = undefined;
</script>

<Original {id} {active}>
  <slot />
</Original>
