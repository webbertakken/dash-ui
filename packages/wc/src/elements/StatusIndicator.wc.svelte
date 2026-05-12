<svelte:options tag="uni-status-indicator" />
<script>
  import Original from '@w5-ui/svelte/components/StatusIndicator.svelte';
  export let color = undefined;
  export let text = undefined;
  export let textColor = undefined;
</script>

<Original {color} {text} {textColor}>
  <slot />
</Original>
