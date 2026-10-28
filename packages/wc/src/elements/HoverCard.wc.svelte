<svelte:options customElement={{ tag: "uni-hover-card", extend: withShadowStyles }} />
<script>
  import Original from '@w5-ui/svelte/components/HoverCard.svelte';
  import { withShadowStyles } from '../styled.ts';
  let {
    heading = undefined,
    description = undefined,
    placement = 'bottom',
    delay = undefined,
    class: className = ''
  } = $props();
</script>

<Original {heading} {description} {placement} {delay} class={className}>
  <slot />
</Original>
