<svelte:options customElement={{ tag: "uni-word-cloud", extend: withShadowStyles }} />
<script>
  import Original from '@w5-ui/svelte/components/WordCloud.svelte';
  import { withShadowStyles } from '../styled.ts';
  let {
    items = [],
    height = 160,
    ariaLabel = 'Word cloud'
  } = $props();
</script>

<Original {items} {height} {ariaLabel}>
  <slot />
</Original>
