<svelte:options customElement={{ tag: "uni-contextual-help", extend: withShadowStyles }} />
<script>
  import Original from '@w5-ui/svelte/components/ContextualHelp.svelte';
  import { withShadowStyles } from '../styled.ts';
  let {
    title = undefined,
    body = undefined,
    placement = 'top'
  } = $props();
</script>

<Original {title} {body} {placement}>
  <slot />
</Original>
