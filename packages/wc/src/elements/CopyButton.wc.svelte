<svelte:options customElement="uni-copy-button" />
<script>
  import Original from '@w5-ui/svelte/components/CopyButton.svelte';
  let {
    text = undefined,
    label = 'Copy'
  } = $props();
</script>

<Original {text} {label}>
  <slot />
</Original>
