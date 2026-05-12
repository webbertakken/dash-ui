<svelte:options customElement="uni-tooltip" />
<script>
  import Original from '@w5-ui/svelte/components/Tooltip.svelte';
  let {
    label = undefined,
    placement = 'top',
    class: className = ''
  } = $props();
</script>

<Original {label} {placement} class={className}>
  <slot />
</Original>
