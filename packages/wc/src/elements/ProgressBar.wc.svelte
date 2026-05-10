<svelte:options tag="uni-progress-bar" />
<script>
  import Original from '@dash-ui/svelte/components/ProgressBar.svelte';
  export let value = undefined;
  export let label = undefined;
  export let valueText = undefined;
  export let color = '#006FFF';
</script>

<Original {value} {label} {valueText} {color}>
  <slot />
</Original>
