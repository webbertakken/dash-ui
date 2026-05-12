<svelte:options customElement="uni-resizable-panel" />
<script>
  import Original from '@w5-ui/svelte/components/ResizablePanel.svelte';
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
