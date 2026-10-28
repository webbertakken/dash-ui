<svelte:options customElement={{ tag: "uni-body-lg", extend: withShadowStyles }} />
<script>
  import Original from '@w5-ui/svelte/components/BodyLg.svelte';
  import { withShadowStyles } from '../styled.ts';
  let {
    class: className = ''
  } = $props();
</script>

<Original class={className}>
  <slot />
</Original>
