<svelte:options customElement="uni-app-layout" />
<script>
  import Original from '@w5-ui/svelte/components/AppLayout.svelte';
  let {
    pageLabel = undefined,
    class: className = ''
  } = $props();
</script>

<Original {pageLabel} class={className}>
  <slot />
</Original>
