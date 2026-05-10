<svelte:options tag="uni-cumulative-distribution" />
<script>
  import Original from '@dash-ui/svelte/components/CumulativeDistribution.svelte';
  export let series = [];
  export let guides = [50, 95];
  export let height = 160;
  export let unit = '';
  export let ariaLabel = 'Cumulative distribution chart';
</script>

<Original {series} {guides} {height} {unit} {ariaLabel}>
  <slot />
</Original>
