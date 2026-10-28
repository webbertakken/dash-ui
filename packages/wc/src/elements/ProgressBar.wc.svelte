<svelte:options customElement={{ tag: "uni-progress-bar", extend: withShadowStyles }} />
<script>
  import Original from '@w5-ui/svelte/components/ProgressBar.svelte';
  import { withShadowStyles } from '../styled.ts';
  let {
    value = undefined,
    label = undefined,
    valueText = undefined,
    color = '#006FFF'
  } = $props();
</script>

<Original {value} {label} {valueText} {color}>
  <slot />
</Original>
