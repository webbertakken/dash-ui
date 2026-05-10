<svelte:options tag="uni-alert" />
<script>
  import Original from '@dash-ui/svelte/components/Alert.svelte';
  export let variant = 'info';
  export let onDismiss = undefined;
</script>

<Original {variant} {onDismiss}>
  <slot />
</Original>
