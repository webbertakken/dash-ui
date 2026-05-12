<svelte:options customElement="uni-progress-bar" />
<script>
  import Original from '@w5-ui/svelte/components/ProgressBar.svelte';
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
