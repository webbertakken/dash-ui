<svelte:options tag="uni-dumbbell-chart" />
<script>
  import Original from '@dash-ui/svelte/components/DumbbellChart.svelte';
  export let items = [];
  export let unit = '';
  export let color = '#006FFF';
  export let ariaLabel = 'Dumbbell chart';
</script>

<Original {items} {unit} {color} {ariaLabel}>
  <slot />
</Original>
