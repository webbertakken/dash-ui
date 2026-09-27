<svelte:options customElement={{ tag: "uni-log-viewer", extend: withShadowStyles }} />
<script>
  import Original from '@w5-ui/svelte/components/LogViewer.svelte';
  import { withShadowStyles } from '../styled.ts';
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
