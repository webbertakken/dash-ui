<svelte:options customElement={{ tag: "uni-card-title", extend: withShadowStyles }} />
<script>
  import Original from '@w5-ui/svelte/components/CardTitle.svelte';
  import { withShadowStyles } from '../styled.ts';
  let {
    class: className = ''
  } = $props();
</script>

<Original class={className}>
  <slot />
</Original>
