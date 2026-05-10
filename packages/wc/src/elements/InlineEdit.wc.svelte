<svelte:options tag="uni-inline-edit" />
<script>
  import Original from '@dash-ui/svelte/components/InlineEdit.svelte';
  export let value = undefined;
  export let onconfirm = undefined;
  export let label = undefined;
  export let placeholder = '';
</script>

<Original {value} {onconfirm} {label} {placeholder}>
  <slot />
</Original>
