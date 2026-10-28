<svelte:options customElement={{ tag: "uni-banner", extend: withShadowStyles }} />
<script>
  import Original from '@w5-ui/svelte/components/Banner.svelte';
  import { withShadowStyles } from '../styled.ts';
  let {
    variant = 'info',
    title = undefined,
    action = undefined
  } = $props();
</script>

<Original {variant} {title} {action}>
  <slot />
</Original>
