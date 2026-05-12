<svelte:options tag="uni-icon-button" />
<script>
  import Original from '@w5-ui/svelte/components/IconButton.svelte';
  export let title = undefined;
  export let type = 'button';
  export let style = '';
</script>

<Original {title} {type} {style}>
  <slot />
</Original>
