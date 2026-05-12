<svelte:options customElement="uni-inline-edit" />
<script>
  import Original from '@w5-ui/svelte/components/InlineEdit.svelte';
  let {
    value = undefined,
    label = undefined,
    placeholder = ''
  } = $props();
</script>

<Original {value} {label} {placeholder}>
  <slot />
</Original>
