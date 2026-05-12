<svelte:options tag="uni-selection-toolbar" />
<script>
  import Original from '@w5-ui/svelte/components/SelectionToolbar.svelte';
  export let count = undefined;
  export let actions = [];
  export let onClear = undefined;
  export let ariaLabel = 'Selection actions';
</script>

<Original {count} {actions} {onClear} {ariaLabel}>
  <slot />
</Original>
