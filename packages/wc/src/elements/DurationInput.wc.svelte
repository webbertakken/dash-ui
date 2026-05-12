<svelte:options customElement="uni-duration-input" />
<script>
  import Original from '@w5-ui/svelte/components/DurationInput.svelte';
  let {
    label = undefined,
    value = 0,
    maxHours = 99,
    disabled = false,
    class: className = ''
  } = $props();
</script>

<Original {label} {value} {maxHours} {disabled} class={className}>
  <slot />
</Original>
