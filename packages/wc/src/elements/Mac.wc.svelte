<svelte:options customElement={{ tag: "uni-mac", extend: withShadowStyles }} />
<script>
  import Original from '@w5-ui/svelte/components/Mac.svelte';
  import { withShadowStyles } from '../styled.ts';
  let {
    class: className = ''
  } = $props();
</script>

<Original class={className}>
  <slot />
</Original>
