<svelte:options customElement="uni-skip-link" />
<script>
  import Original from '@w5-ui/svelte/components/SkipLink.svelte';
  export let href = '#main-content';
</script>

<Original {href}>
  <slot />
</Original>
