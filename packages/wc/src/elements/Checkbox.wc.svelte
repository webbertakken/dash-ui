<svelte:options customElement="uni-checkbox" />
<script>
  import Original from '@w5-ui/svelte/components/Checkbox.svelte';
  let {
    checked = false,
    indeterminate = false,
    label = undefined,
    id = undefined,
    disabled = false
  } = $props();
</script>

<Original {checked} {indeterminate} {label} {id} {disabled}>
  <slot />
</Original>
