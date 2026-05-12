<svelte:options customElement="uni-card" />
<script>
  import Original from '@w5-ui/svelte/components/Card.svelte';
  let {
    span = undefined,
    class: className = '',
    style = ''
  } = $props();
</script>

<Original {span} class={className} {style}>
  <slot />
</Original>
