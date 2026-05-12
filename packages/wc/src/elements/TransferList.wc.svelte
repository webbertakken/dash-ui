<svelte:options customElement="uni-transfer-list" />
<script>
  import Original from '@w5-ui/svelte/components/TransferList.svelte';
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
