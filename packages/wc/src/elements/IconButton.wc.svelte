<svelte:options customElement="uni-icon-button" />
<script>
  import Original from '@w5-ui/svelte/components/IconButton.svelte';
  let {
    type = 'button',
    class: className = '',
    style = ''
  } = $props();
</script>

<Original {type} class={className} {style}>
  <slot />
</Original>
