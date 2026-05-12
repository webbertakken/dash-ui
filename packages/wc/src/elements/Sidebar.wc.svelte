<svelte:options customElement="uni-sidebar" />
<script>
  import Original from '@w5-ui/svelte/components/Sidebar.svelte';
  let {
    sections = [],
    activeId = undefined
  } = $props();
</script>

<Original {sections} {activeId}>
  <slot />
</Original>
