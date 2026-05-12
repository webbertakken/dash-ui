<svelte:options customElement="uni-bullet-chart" />
<script>
  import Original from '@w5-ui/svelte/components/BulletChart.svelte';
  let {
    items = [],
    max = 100,
    ariaLabel = 'Bullet chart'
  } = $props();
</script>

<Original {items} {max} {ariaLabel}>
  <slot />
</Original>
