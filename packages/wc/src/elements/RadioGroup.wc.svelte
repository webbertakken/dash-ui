<svelte:options customElement="uni-radio-group" />
<script>
  import Original from '@w5-ui/svelte/components/RadioGroup.svelte';
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
