<svelte:options customElement="uni-grid" />
<script>
  import Original from '@w5-ui/svelte/components/Grid.svelte';
  let {
    class: className = ''
  } = $props();
</script>

<Original class={className}>
  <slot />
</Original>
