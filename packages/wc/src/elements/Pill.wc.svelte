<svelte:options customElement="uni-pill" />
<script>
  import Original from '@w5-ui/svelte/components/Pill.svelte';
  export let variant = 'neutral';
  export let showDot = true;
  export let style = '';
</script>

<Original {variant} {showDot} {style}>
  <slot />
</Original>
