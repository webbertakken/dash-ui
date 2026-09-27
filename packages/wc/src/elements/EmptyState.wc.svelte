<svelte:options customElement={{ tag: "uni-empty-state", extend: withShadowStyles }} />
<script>
  import Original from '@w5-ui/svelte/components/EmptyState.svelte';
  import { withShadowStyles } from '../styled.ts';
  let {
    title = undefined,
    description = undefined,
    class: className = ''
  } = $props();
</script>

<Original {title} {description} class={className}>
  <slot />
</Original>
