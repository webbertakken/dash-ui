<svelte:options tag="uni-alert" />
<script>
  import Original from '@w5-ui/svelte/components/Alert.svelte';
  export let variant = 'info';
  export let onDismiss = undefined;
</script>

<Original {variant} {onDismiss}>
  <slot />
</Original>
