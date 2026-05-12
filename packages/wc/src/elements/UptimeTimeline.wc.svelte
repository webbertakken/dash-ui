<svelte:options customElement="uni-uptime-timeline" />
<script>
  import Original from '@w5-ui/svelte/components/UptimeTimeline.svelte';
  let {
    series = [],
    xLabels = [],
    ariaLabel = 'Uptime timeline'
  } = $props();
</script>

<Original {series} {xLabels} {ariaLabel}>
  <slot />
</Original>
