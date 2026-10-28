<svelte:options customElement={{ tag: "uni-alert", extend: withShadowStyles }} />
<script>
  import Original from '@w5-ui/svelte/components/Alert.svelte';
  import { withShadowStyles } from '../styled.ts';
  let {
    variant = 'info'
  } = $props();
</script>

<Original {variant}>
  <slot />
</Original>
