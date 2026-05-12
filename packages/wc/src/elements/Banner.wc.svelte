<svelte:options customElement="uni-banner" />
<script>
  import Original from '@w5-ui/svelte/components/Banner.svelte';
  let {
    variant = 'info',
    title = undefined,
    action = undefined
  } = $props();
</script>

<Original {variant} {title} {action}>
  <slot />
</Original>
