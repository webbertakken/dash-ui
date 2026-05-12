<svelte:options customElement="uni-icon-button" />
<script>
  import Original from '@w5-ui/svelte/components/IconButton.svelte';
  let {
    title = undefined,
    type = 'button',
    class: className = '',
    style = ''
  } = $props();
</script>

<Original {title} {type} class={className} {style}>
  <slot />
</Original>
