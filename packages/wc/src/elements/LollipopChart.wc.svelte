<svelte:options tag="uni-lollipop-chart" />
<script>
  import Original from '@dash-ui/svelte/components/LollipopChart.svelte';
  export let items = [];
  export let unit = '';
  export let color = '#006FFF';
  export let ariaLabel = 'Lollipop chart';
</script>

<Original {items} {unit} {color} {ariaLabel}>
  <slot />
</Original>
