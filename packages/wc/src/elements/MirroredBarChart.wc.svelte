<svelte:options customElement={{ tag: "uni-mirrored-bar-chart", extend: withShadowStyles }} />
<script>
  import Original from '@w5-ui/svelte/components/MirroredBarChart.svelte';
  import { withShadowStyles } from '../styled.ts';
  let {
    items = [],
    leftLabel = 'Download',
    rightLabel = 'Upload',
    leftColor = '#006FFF',
    rightColor = '#00C8C8',
    unit = '',
    ariaLabel = 'Mirrored bar chart'
  } = $props();
</script>

<Original {items} {leftLabel} {rightLabel} {leftColor} {rightColor} {unit} {ariaLabel}>
  <slot />
</Original>
