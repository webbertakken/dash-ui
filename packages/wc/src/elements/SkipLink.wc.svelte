<svelte:options customElement={{ tag: "uni-skip-link", extend: withShadowStyles }} />
<script>
  import Original from '@w5-ui/svelte/components/SkipLink.svelte';
  import { withShadowStyles } from '../styled.ts';
  let {
    href = '#main-content',
    class: className = ''
  } = $props();
</script>

<Original {href} class={className}>
  <slot />
</Original>
