<svelte:options tag="uni-health-bar" />
<script>
  import Original from '@dash-ui/svelte/components/HealthBar.svelte';
  export let value = undefined;
  export let fillStyle = '';
  export let label = undefined;
  export let valueText = undefined;
</script>

<Original {value} {fillStyle} {label} {valueText}>
  <slot />
</Original>
