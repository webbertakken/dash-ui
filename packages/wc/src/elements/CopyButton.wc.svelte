<svelte:options tag="uni-copy-button" />
<script>
  import Original from '@dash-ui/svelte/components/CopyButton.svelte';
  export let text = undefined;
  export let label = 'Copy';
</script>

<Original {text} {label}>
  <slot />
</Original>
