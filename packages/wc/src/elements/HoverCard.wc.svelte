<svelte:options customElement={{ tag: "uni-hover-card", extend: withShadowStyles }} />
<script>
  import Original from '@w5-ui/svelte/components/HoverCard.svelte';
  import { withShadowStyles } from '../styled.ts';
  let {
    placement = 'bottom',
    delay = 300,
    class: className = ''
  } = $props();
</script>

<Original {placement} {delay} class={className}>
  <slot />
</Original>
