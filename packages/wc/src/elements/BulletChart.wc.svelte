<svelte:options tag="uni-bullet-chart" />
<script>
  import Original from '@dash-ui/svelte/components/BulletChart.svelte';
  export let items = [];
  export let max = 100;
  export let ariaLabel = 'Bullet chart';
</script>

<Original {items} {max} {ariaLabel}>
  <slot />
</Original>
