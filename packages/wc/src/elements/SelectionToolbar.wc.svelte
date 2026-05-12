<svelte:options customElement="uni-selection-toolbar" />
<script>
  import Original from '@w5-ui/svelte/components/SelectionToolbar.svelte';
  let {
    count = undefined,
    actions = [],
    ariaLabel = 'Selection actions'
  } = $props();
</script>

<Original {count} {actions} {ariaLabel}>
  <slot />
</Original>
