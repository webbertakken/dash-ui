<svelte:options customElement={{ tag: "uni-bullet-chart", extend: withShadowStyles }} />
<script>
  import Original from '@w5-ui/svelte/components/BulletChart.svelte';
  import { withShadowStyles } from '../styled.ts';
  let {
    items = [],
    max = 100,
    ariaLabel = 'Bullet chart'
  } = $props();
</script>

<Original {items} {max} {ariaLabel}>
  <slot />
</Original>
