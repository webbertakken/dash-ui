<svelte:options customElement={{ tag: "uni-stat-number", extend: withShadowStyles }} />
<script>
  import Original from '@w5-ui/svelte/components/StatNumber.svelte';
  import { withShadowStyles } from '../styled.ts';
  let {
    class: className = ''
  } = $props();
</script>

<Original class={className}>
  <slot />
</Original>
