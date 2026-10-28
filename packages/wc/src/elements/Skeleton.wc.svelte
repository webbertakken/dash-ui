<svelte:options customElement={{ tag: "uni-skeleton", extend: withShadowStyles }} />
<script>
  import Original from '@w5-ui/svelte/components/Skeleton.svelte';
  import { withShadowStyles } from '../styled.ts';
  let {
    variant = 'text',
    width = undefined,
    height = undefined,
    class: className = '',
    ariaLabel = 'Loading'
  } = $props();
</script>

<Original {variant} {width} {height} class={className} {ariaLabel}>
  <slot />
</Original>
