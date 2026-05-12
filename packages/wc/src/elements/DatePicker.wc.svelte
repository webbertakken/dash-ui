<svelte:options customElement="uni-date-picker" />
<script>
  import Original from '@w5-ui/svelte/components/DatePicker.svelte';
  let {
    value = null,
    placeholder = 'Pick a date',
    disabled = false
  } = $props();
</script>

<Original {value} {placeholder} {disabled}>
  <slot />
</Original>
