<svelte:options customElement={{ tag: "uni-callout", extend: withShadowStyles }} />
<script>
  import Original from '@w5-ui/svelte/components/Callout.svelte';
  import { withShadowStyles } from '../styled.ts';
  let {
    variant = 'info',
    title = undefined
  } = $props();
</script>

<Original {variant} {title}>
  <slot />
</Original>
