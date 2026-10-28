<svelte:options customElement={{ tag: "uni-tag", extend: withShadowStyles }} />
<script>
  import Original from '@w5-ui/svelte/components/Tag.svelte';
  import { withShadowStyles } from '../styled.ts';
  let {
    label = undefined,
    class: className = ''
  } = $props();
</script>

<Original {label} class={className}>
  <slot />
</Original>
