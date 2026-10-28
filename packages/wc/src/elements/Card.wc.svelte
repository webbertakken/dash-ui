<svelte:options customElement={{ tag: "uni-card", extend: withShadowStyles }} />
<script>
  import Original from '@w5-ui/svelte/components/Card.svelte';
  import { withShadowStyles } from '../styled.ts';
  let {
    span = undefined,
    class: className = '',
    style = ''
  } = $props();
</script>

<Original {span} class={className} {style}>
  <slot />
</Original>
