<svelte:options customElement="uni-sparkline" />
<script>
  import Original from '@w5-ui/svelte/components/Sparkline.svelte';
  let {
    bars = 36,
    active = false,
    seed = 1,
    ariaLabel = 'Activity sparkline'
  } = $props();
</script>

<Original {bars} {active} {seed} {ariaLabel}>
  <slot />
</Original>
