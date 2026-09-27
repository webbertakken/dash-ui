<svelte:options customElement={{ tag: "uni-h3", extend: withShadowStyles }} />
<script>
  import Original from '@w5-ui/svelte/components/H3.svelte';
  import { withShadowStyles } from '../styled.ts';
  let {
    class: className = ''
  } = $props();
</script>

<Original class={className}>
  <slot />
</Original>
