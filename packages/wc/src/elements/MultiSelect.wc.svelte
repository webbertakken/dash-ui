<svelte:options customElement="uni-multi-select" />
<script>
  import Original from '@w5-ui/svelte/components/MultiSelect.svelte';
  let {
    options = [],
    value = [],
    label = undefined,
    placeholder = 'Select…',
    id = undefined,
    disabled = false,
    class: className = ''
  } = $props();
</script>

<Original {options} {value} {label} {placeholder} {id} {disabled} class={className}>
  <slot />
</Original>
