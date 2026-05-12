<svelte:options customElement="uni-alert" />
<script>
  import Original from '@w5-ui/svelte/components/Alert.svelte';
  let {
    variant = 'info'
  } = $props();
</script>

<Original {variant}>
  <slot />
</Original>
