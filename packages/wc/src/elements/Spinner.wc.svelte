<svelte:options customElement={{ tag: "uni-spinner", extend: withShadowStyles }} />
<script>
  import Original from '@w5-ui/svelte/components/Spinner.svelte';
  import { withShadowStyles } from '../styled.ts';
  let {
    size = 'md',
    label = 'Loading'
  } = $props();
</script>

<Original {size} {label}>
  <slot />
</Original>
