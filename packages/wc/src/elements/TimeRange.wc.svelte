<svelte:options customElement={{ tag: "uni-time-range", extend: withShadowStyles }} />
<script>
  import Original from '@w5-ui/svelte/components/TimeRange.svelte';
  import { withShadowStyles } from '../styled.ts';
  let {
    value = '1h'
  } = $props();
</script>

<Original {value}>
  <slot />
</Original>
