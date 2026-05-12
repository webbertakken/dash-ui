<svelte:options customElement="uni-toggle" />
<script>
  import Original from '@w5-ui/svelte/components/Toggle.svelte';
  let {
    on = false,
    ariaLabel = undefined,
    ariaDescribedBy = undefined
  } = $props();
</script>

<Original {on} {ariaLabel} {ariaDescribedBy}>
  <slot />
</Original>
