<svelte:options customElement={{ tag: "uni-step-chart", extend: withShadowStyles }} />
<script>
  import Original from '@w5-ui/svelte/components/StepChart.svelte';
  import { withShadowStyles } from '../styled.ts';
  let {
    series = [],
    labels = [],
    height = 160,
    ariaLabel = 'Step chart'
  } = $props();
</script>

<Original {series} {labels} {height} {ariaLabel}>
  <slot />
</Original>
