<svelte:options customElement="uni-callout" />
<script>
  import Original from '@w5-ui/svelte/components/Callout.svelte';
  let {
    variant = 'info',
    title = undefined
  } = $props();
</script>

<Original {variant} {title}>
  <slot />
</Original>
