<svelte:options customElement={{ tag: "uni-table-shell", extend: withShadowStyles }} />
<script>
  import Original from '@w5-ui/svelte/components/TableShell.svelte';
  import { withShadowStyles } from '../styled.ts';
  let {
    class: className = ''
  } = $props();
</script>

<Original class={className}>
  <slot />
</Original>
