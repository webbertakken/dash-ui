<svelte:options tag="uni-tabs" />
<script>
  import Original from '@w5-ui/svelte/components/Tabs.svelte';
  export let items = [];
  export let active = undefined;
  export let ariaLabel = undefined;
</script>

<Original {items} {active} {ariaLabel}>
  <slot />
</Original>
