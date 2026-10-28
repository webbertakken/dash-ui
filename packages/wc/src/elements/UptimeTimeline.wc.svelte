<svelte:options customElement={{ tag: "uni-uptime-timeline", extend: withShadowStyles }} />
<script>
  import Original from '@w5-ui/svelte/components/UptimeTimeline.svelte';
  import { withShadowStyles } from '../styled.ts';
  let {
    series = [],
    xLabels = [],
    ariaLabel = 'Uptime timeline'
  } = $props();
</script>

<Original {series} {xLabels} {ariaLabel}>
  <slot />
</Original>
