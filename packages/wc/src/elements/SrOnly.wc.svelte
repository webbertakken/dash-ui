<svelte:options customElement={{ tag: "uni-sr-only", extend: withShadowStyles }} />
<script>
  import Original from '@w5-ui/svelte/components/SrOnly.svelte';
  import { withShadowStyles } from '../styled.ts';
  let {
    class: className = ''
  } = $props();
</script>

<Original class={className}>
  <slot />
</Original>
