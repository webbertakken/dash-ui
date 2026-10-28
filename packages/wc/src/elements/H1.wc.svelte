<svelte:options customElement={{ tag: "uni-h1", extend: withShadowStyles }} />
<script>
  import Original from '@w5-ui/svelte/components/H1.svelte';
  import { withShadowStyles } from '../styled.ts';
  let {
    class: className = ''
  } = $props();
</script>

<Original class={className}>
  <slot />
</Original>
