<svelte:options customElement={{ tag: "uni-label", extend: withShadowStyles }} />
<script>
  import Original from '@w5-ui/svelte/components/Label.svelte';
  import { withShadowStyles } from '../styled.ts';
  let {
    class: className = ''
  } = $props();
</script>

<Original class={className}>
  <slot />
</Original>
