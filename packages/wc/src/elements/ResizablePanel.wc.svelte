<svelte:options customElement={{ tag: "uni-resizable-panel", extend: withShadowStyles }} />
<script>
  import Original from '@w5-ui/svelte/components/ResizablePanel.svelte';
  import { withShadowStyles } from '../styled.ts';
  let {
    defaultSize = 50,
    min = 20,
    max = 80,
    orientation = 'vertical',
    label = 'Resize panels',
    style = ''
  } = $props();
</script>

<Original {defaultSize} {min} {max} {orientation} {label} {style}>
  <slot />
</Original>
