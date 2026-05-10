<svelte:options tag="uni-pill" />
<script>
  import Original from '@dash-ui/svelte/components/Pill.svelte';
  export let variant = 'neutral';
  export let showDot = true;
  export let style = '';
</script>

<Original {variant} {showDot} {style}>
  <slot />
</Original>
