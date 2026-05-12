<svelte:options tag="uni-tag" />
<script>
  import Original from '@w5-ui/svelte/components/Tag.svelte';
  export let label = undefined;
</script>

<Original {label}>
  <slot />
</Original>
