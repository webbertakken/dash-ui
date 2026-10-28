<svelte:options customElement={{ tag: "uni-column-toggle", extend: withShadowStyles }} />
<script>
  import Original from '@w5-ui/svelte/components/ColumnToggle.svelte';
  import { withShadowStyles } from '../styled.ts';
  let {
    columns = [],
    visible = new Set()
  } = $props();
</script>

<Original {columns} {visible}>
  <slot />
</Original>
