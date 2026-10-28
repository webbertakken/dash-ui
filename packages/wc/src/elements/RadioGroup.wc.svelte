<svelte:options customElement={{ tag: "uni-radio-group", extend: withShadowStyles }} />
<script>
  import Original from '@w5-ui/svelte/components/RadioGroup.svelte';
  import { withShadowStyles } from '../styled.ts';
  let {
    legend = undefined,
    name = undefined,
    options = [],
    value = undefined,
    srOnlyLegend = false,
    horizontal = false
  } = $props();
</script>

<Original {legend} {name} {options} {value} {srOnlyLegend} {horizontal}>
  <slot />
</Original>
