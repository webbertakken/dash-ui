<svelte:options customElement="uni-time-picker" />
<script>
  import Original from '@w5-ui/svelte/components/TimePicker.svelte';
  let {
    label = undefined,
    value = '00:00',
    disabled = false,
    class: className = ''
  } = $props();
</script>

<Original {label} {value} {disabled} class={className}>
  <slot />
</Original>
