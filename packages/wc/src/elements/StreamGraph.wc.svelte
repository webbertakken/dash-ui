<svelte:options customElement={{ tag: "uni-stream-graph", extend: withShadowStyles }} />
<script>
  import Original from '@w5-ui/svelte/components/StreamGraph.svelte';
  import { withShadowStyles } from '../styled.ts';
  let {
    labels = [],
    series = [],
    ariaLabel = 'Stream graph'
  } = $props();
</script>

<Original {labels} {series} {ariaLabel}>
  <slot />
</Original>
