<svelte:options customElement="uni-input-group" />
<script>
  import Original from '@w5-ui/svelte/components/InputGroup.svelte';
  let {
    prefix = undefined,
    suffix = undefined
  } = $props();
</script>

<Original {prefix} {suffix}>
  <slot />
</Original>
