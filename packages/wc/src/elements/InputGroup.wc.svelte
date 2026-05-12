<svelte:options customElement="uni-input-group" />
<script>
  import Original from '@w5-ui/svelte/components/InputGroup.svelte';
  export let prefix = undefined;
  export let suffix = undefined;
</script>

<Original {prefix} {suffix}>
  <slot />
</Original>
