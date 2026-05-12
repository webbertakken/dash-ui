<svelte:options tag="uni-spoiler" />
<script>
  import Original from '@w5-ui/svelte/components/Spoiler.svelte';
  export let maxHeight = 80;
  export let showLabel = 'Show more';
  export let hideLabel = 'Show less';
</script>

<Original {maxHeight} {showLabel} {hideLabel}>
  <slot />
</Original>
