<svelte:options customElement={{ tag: "uni-tooltip", extend: withShadowStyles }} />
<script>
  import Original from '@w5-ui/svelte/components/Tooltip.svelte';
  import { withShadowStyles } from '../styled.ts';
  let {
    label = undefined,
    placement = 'top',
    class: className = ''
  } = $props();
</script>

<Original {label} {placement} class={className}>
  <slot />
</Original>
