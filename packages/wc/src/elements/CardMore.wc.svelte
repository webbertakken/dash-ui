<svelte:options customElement={{ tag: "uni-card-more", extend: withShadowStyles }} />
<script>
  import Original from '@w5-ui/svelte/components/CardMore.svelte';
  import { withShadowStyles } from '../styled.ts';
  let {
    href = undefined,
    class: className = ''
  } = $props();
</script>

<Original {href} class={className}>
  <slot />
</Original>
