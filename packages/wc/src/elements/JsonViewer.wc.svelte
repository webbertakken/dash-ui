<svelte:options customElement={{ tag: "uni-json-viewer", extend: withShadowStyles }} />
<script>
  import Original from '@w5-ui/svelte/components/JsonViewer.svelte';
  import { withShadowStyles } from '../styled.ts';
  let {
    data = undefined,
    label = 'JSON viewer',
    defaultExpanded = true,
    maxDepth = 3
  } = $props();
</script>

<Original {data} {label} {defaultExpanded} {maxDepth}>
  <slot />
</Original>
