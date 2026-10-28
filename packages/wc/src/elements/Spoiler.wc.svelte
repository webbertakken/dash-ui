<svelte:options customElement={{ tag: "uni-spoiler", extend: withShadowStyles }} />
<script>
  import Original from '@w5-ui/svelte/components/Spoiler.svelte';
  import { withShadowStyles } from '../styled.ts';
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
