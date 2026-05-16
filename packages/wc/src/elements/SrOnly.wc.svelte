<svelte:options customElement="uni-sr-only" />
<script>
  import Original from '@w5-ui/svelte/components/SrOnly.svelte';
  let {
    class: className = ''
  } = $props();
</script>

<Original class={className}>
  <slot />
</Original>
