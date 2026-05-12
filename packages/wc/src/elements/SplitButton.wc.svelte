<svelte:options customElement="uni-split-button" />
<script>
  import Original from '@w5-ui/svelte/components/SplitButton.svelte';
  let {
    label = undefined,
    variant = 'ghost',
    disabled = false,
    items = []
  } = $props();
</script>

<Original {label} {variant} {disabled} {items}>
  <slot />
</Original>
