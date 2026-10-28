<svelte:options customElement={{ tag: "uni-switch-port-grid", extend: withShadowStyles }} />
<script>
  import Original from '@w5-ui/svelte/components/SwitchPortGrid.svelte';
  import { withShadowStyles } from '../styled.ts';
  let {
    ports = [],
    columns = 12,
    ariaLabel = 'Switch port panel'
  } = $props();
</script>

<Original {ports} {columns} {ariaLabel}>
  <slot />
</Original>
