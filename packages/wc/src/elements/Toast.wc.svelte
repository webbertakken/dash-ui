<svelte:options customElement={{ tag: "uni-toast", extend: withShadowStyles }} />
<script>
  import Original from '@w5-ui/svelte/components/Toast.svelte';
  import { withShadowStyles } from '../styled.ts';
  let {
    /* no public props */
  } = $props();
</script>

<Original >
  <slot />
</Original>
