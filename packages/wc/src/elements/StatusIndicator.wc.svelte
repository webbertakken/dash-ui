<svelte:options customElement="uni-status-indicator" />
<script>
  import Original from '@w5-ui/svelte/components/StatusIndicator.svelte';
  let {
    color = undefined,
    text = undefined,
    textColor = undefined
  } = $props();
</script>

<Original {color} {text} {textColor}>
  <slot />
</Original>
