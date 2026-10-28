<svelte:options customElement={{ tag: "uni-transfer-list", extend: withShadowStyles }} />
<script>
  import Original from '@w5-ui/svelte/components/TransferList.svelte';
  import { withShadowStyles } from '../styled.ts';
  let {
    sourceLabel = 'Available',
    targetLabel = 'Selected',
    source = [],
    target = [],
    class: className = ''
  } = $props();
</script>

<Original {sourceLabel} {targetLabel} {source} {target} class={className}>
  <slot />
</Original>
