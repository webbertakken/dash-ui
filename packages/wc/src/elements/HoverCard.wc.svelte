<svelte:options customElement="uni-hover-card" />
<script>
  import Original from '@w5-ui/svelte/components/HoverCard.svelte';
  let {
    placement = 'bottom',
    delay = 300,
    class: className = ''
  } = $props();
</script>

<Original {placement} {delay} class={className}>
  <slot />
</Original>
