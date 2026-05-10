<svelte:options tag="uni-status-indicator" />
<script>
  import Original from '@dash-ui/svelte/components/StatusIndicator.svelte';
  export let color = undefined;
  export let text = undefined;
  export let textColor = undefined;
</script>

<Original {color} {text} {textColor}>
  <slot />
</Original>
