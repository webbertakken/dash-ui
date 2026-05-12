<svelte:options customElement="uni-pill" />
<script>
  import Original from '@w5-ui/svelte/components/Pill.svelte';
  let {
    variant = 'neutral',
    showDot = true,
    class: className = '',
    style = ''
  } = $props();
</script>

<Original {variant} {showDot} class={className} {style}>
  <slot />
</Original>
