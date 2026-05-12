<svelte:options customElement="uni-color-picker" />
<script>
  import Original from '@w5-ui/svelte/components/ColorPicker.svelte';
  let {
    label = 'Colour',
    srOnlyLabel = false,
    value = COLOR_SWATCHES[0].value,
    swatches = COLOR_SWATCHES,
    disabled = false
  } = $props();
</script>

<Original {label} {srOnlyLabel} {value} {swatches} {disabled}>
  <slot />
</Original>
