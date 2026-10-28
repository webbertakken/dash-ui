<svelte:options customElement={{ tag: "uni-health-bar", extend: withShadowStyles }} />
<script>
  import Original from '@w5-ui/svelte/components/HealthBar.svelte';
  import { withShadowStyles } from '../styled.ts';
  let {
    value = undefined,
    fillStyle = '',
    label = undefined,
    valueText = undefined
  } = $props();
</script>

<Original {value} {fillStyle} {label} {valueText}>
  <slot />
</Original>
