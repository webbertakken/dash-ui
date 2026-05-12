<svelte:options customElement="uni-copy-button" />
<script>
  import Original from '@w5-ui/svelte/components/CopyButton.svelte';
  export let text = undefined;
  export let label = 'Copy';
</script>

<Original {text} {label}>
  <slot />
</Original>
