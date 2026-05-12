<svelte:options customElement="uni-segmented-control" />
<script>
  import Original from '@w5-ui/svelte/components/SegmentedControl.svelte';
  let {
    label = undefined,
    options = [],
    value = options[0]?.value ?? ''
  } = $props();
</script>

<Original {label} {options} {value}>
  <slot />
</Original>
