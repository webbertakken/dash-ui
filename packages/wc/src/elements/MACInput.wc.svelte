<svelte:options customElement={{ tag: "uni-macinput", extend: withShadowStyles }} />
<script>
  import Original from '@w5-ui/svelte/components/MACInput.svelte';
  import { withShadowStyles } from '../styled.ts';
  let {
    label = undefined,
    value = '00:00:00:00:00:00',
    disabled = false,
    class: className = ''
  } = $props();
</script>

<Original {label} {value} {disabled} class={className}>
  <slot />
</Original>
