<svelte:options customElement={{ tag: "uni-display1", extend: withShadowStyles }} />
<script>
  import Original from '@w5-ui/svelte/components/Display1.svelte';
  import { withShadowStyles } from '../styled.ts';
  let {
    class: className = ''
  } = $props();
</script>

<Original class={className}>
  <slot />
</Original>
