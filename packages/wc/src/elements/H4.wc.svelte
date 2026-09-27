<svelte:options customElement={{ tag: "uni-h4", extend: withShadowStyles }} />
<script>
  import Original from '@w5-ui/svelte/components/H4.svelte';
  import { withShadowStyles } from '../styled.ts';
  let {
    class: className = ''
  } = $props();
</script>

<Original class={className}>
  <slot />
</Original>
