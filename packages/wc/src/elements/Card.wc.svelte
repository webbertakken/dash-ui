<svelte:options customElement="uni-card" />
<script>
  import Original from '@w5-ui/svelte/components/Card.svelte';
  export let span = undefined;
  export let style = '';
</script>

<Original {span} {style}>
  <slot />
</Original>
