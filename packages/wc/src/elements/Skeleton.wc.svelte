<svelte:options customElement="uni-skeleton" />
<script>
  import Original from '@w5-ui/svelte/components/Skeleton.svelte';
  let {
    variant = 'text',
    width = undefined,
    height = undefined,
    class: className = '',
    ariaLabel = 'Loading'
  } = $props();
</script>

<Original {variant} {width} {height} class={className} {ariaLabel}>
  <slot />
</Original>
