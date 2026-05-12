<svelte:options customElement="uni-health-bar" />
<script>
  import Original from '@w5-ui/svelte/components/HealthBar.svelte';
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
