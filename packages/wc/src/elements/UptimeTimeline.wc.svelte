<svelte:options tag="uni-uptime-timeline" />
<script>
  import Original from '@w5-ui/svelte/components/UptimeTimeline.svelte';
  export let series = [];
  export let xLabels = [];
  export let ariaLabel = 'Uptime timeline';
</script>

<Original {series} {xLabels} {ariaLabel}>
  <slot />
</Original>
