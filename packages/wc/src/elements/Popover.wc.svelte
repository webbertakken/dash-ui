<svelte:options customElement={{ tag: "uni-popover", extend: withShadowStyles }} />
<script>
  import Original from '@w5-ui/svelte/components/Popover.svelte';
  import { withShadowStyles } from '../styled.ts';
  let {
    label = undefined,
    variant = 'ghost',
    title = undefined,
    placement = 'bottom-start',
    open = false,
    width = 'sm'
  } = $props();
</script>

<Original {label} {variant} {title} {placement} {open} {width}>
  <slot />
</Original>
