<svelte:options customElement={{ tag: "uni-avatar", extend: withShadowStyles }} />
<script>
  import Original from '@w5-ui/svelte/components/Avatar.svelte';
  import { withShadowStyles } from '../styled.ts';
  let {
    initials = '?',
    src = undefined,
    alt = undefined,
    size = 'md',
    status = undefined,
    class: className = '',
    style = ''
  } = $props();
</script>

<Original {initials} {src} {alt} {size} {status} class={className} {style}>
  <slot />
</Original>
