<svelte:options tag="uni-kbd" />
<script>
  import Original from '@w5-ui/svelte/components/Kbd.svelte';
  export let keys = undefined;
</script>

<Original {keys}>
  <slot />
</Original>
