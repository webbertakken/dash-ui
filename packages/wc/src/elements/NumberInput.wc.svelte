<svelte:options customElement="uni-number-input" />
<script>
  import Original from '@w5-ui/svelte/components/NumberInput.svelte';
  let {
    label = undefined,
    value = 0,
    min = undefined,
    max = undefined,
    step = 1,
    suffix = undefined,
    disabled = false,
    id = undefined,
    class: className = ''
  } = $props();
</script>

<Original {label} {value} {min} {max} {step} {suffix} {disabled} {id} class={className}>
  <slot />
</Original>
