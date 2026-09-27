<svelte:options customElement="uni-hover-card" />
<script>
  import Original from '@w5-ui/svelte/components/HoverCard.svelte';
  let {
    heading = undefined,
    description = undefined,
    placement = 'bottom',
    delay = undefined,
    class: className = ''
  } = $props();
</script>

<Original {heading} {description} {placement} {delay} class={className}>
  <slot />
</Original>
