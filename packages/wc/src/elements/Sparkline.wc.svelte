<svelte:options tag="uni-sparkline" />
<script>
  import Original from '@w5-ui/svelte/components/Sparkline.svelte';
  export let bars = 36;
  export let active = false;
  export let seed = 1;
  export let ariaLabel = 'Activity sparkline';
</script>

<Original {bars} {active} {seed} {ariaLabel}>
  <slot />
</Original>
