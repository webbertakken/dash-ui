<svelte:options tag="uni-tab-panel" />
<script>
  import Original from '@dash-ui/svelte/components/TabPanel.svelte';
  export let id = undefined;
  export let active = undefined;
</script>

<Original {id} {active}>
  <slot />
</Original>
