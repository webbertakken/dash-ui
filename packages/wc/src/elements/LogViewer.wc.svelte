<svelte:options customElement="uni-log-viewer" />
<script>
  import Original from '@w5-ui/svelte/components/LogViewer.svelte';
  let {
    entries = [],
    height = 360,
    defaultFollow = true,
    ariaLabel = 'Log entries',
    className = ''
  } = $props();
</script>

<Original {entries} {height} {defaultFollow} {ariaLabel} {className}>
  <slot />
</Original>
