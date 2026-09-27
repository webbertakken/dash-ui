<svelte:options customElement="uni-tooltip" />
<script>
  import Original from '@w5-ui/svelte/components/Tooltip.svelte';
  let {
    label = undefined,
    placement = 'top',
    delay = undefined,
    class: className = ''
  } = $props();
</script>

<Original {label} {placement} {delay} class={className}>
  <slot />
</Original>
