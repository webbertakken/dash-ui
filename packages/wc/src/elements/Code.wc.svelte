<svelte:options customElement={{ tag: "uni-code", extend: withShadowStyles }} />
<script>
  import Original from '@w5-ui/svelte/components/Code.svelte';
  import { withShadowStyles } from '../styled.ts';
  let {
    class: className = ''
  } = $props();
</script>

<Original class={className}>
  <slot />
</Original>
