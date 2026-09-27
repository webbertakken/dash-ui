<svelte:options customElement={{ tag: "uni-status-ring", extend: withShadowStyles }} />
<script>
  import Original from '@w5-ui/svelte/components/StatusRing.svelte';
  import { withShadowStyles } from '../styled.ts';
  let {
    class: className = '',
    style = '',
    status = 'ok'
  } = $props();
</script>

<Original class={className} {style} {status}>
  <slot />
</Original>
