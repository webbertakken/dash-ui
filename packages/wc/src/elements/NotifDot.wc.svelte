<svelte:options customElement={{ tag: "uni-notif-dot", extend: withShadowStyles }} />
<script>
  import Original from '@w5-ui/svelte/components/NotifDot.svelte';
  import { withShadowStyles } from '../styled.ts';
  let {
    class: className = ''
  } = $props();
</script>

<Original class={className}>
  <slot />
</Original>
