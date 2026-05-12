<svelte:options customElement="uni-date-range-picker" />
<script>
  import Original from '@w5-ui/svelte/components/DateRangePicker.svelte';
  let {
    value = { start: null, end: null },
    placeholder = 'Select date range',
    disabled = false
  } = $props();
</script>

<Original {value} {placeholder} {disabled}>
  <slot />
</Original>
