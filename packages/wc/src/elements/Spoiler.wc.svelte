<svelte:options customElement="uni-spoiler" />
<script>
  import Original from '@w5-ui/svelte/components/Spoiler.svelte';
  let {
    maxHeight = 80,
    showLabel = 'Show more',
    hideLabel = 'Show less',
    class: klass = ''
  } = $props();
</script>

<Original {maxHeight} {showLabel} {hideLabel} class={klass}>
  <slot />
</Original>
