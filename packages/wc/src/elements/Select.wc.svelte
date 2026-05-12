<svelte:options customElement="uni-select" />
<script>
  import Original from '@w5-ui/svelte/components/Select.svelte';
  let {
    options = [],
    value = undefined,
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
