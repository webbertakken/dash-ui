<svelte:options customElement={{ tag: "uni-split-button", extend: withShadowStyles }} />
<script>
  import Original from '@w5-ui/svelte/components/SplitButton.svelte';
  import { withShadowStyles } from '../styled.ts';
  let {
    label = undefined,
    variant = 'ghost',
    disabled = false,
    items = []
  } = $props();
</script>

<Original {label} {variant} {disabled} {items}>
  <slot />
</Original>
