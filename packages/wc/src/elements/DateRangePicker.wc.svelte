<svelte:options customElement={{ tag: "uni-date-range-picker", extend: withShadowStyles }} />
<script>
  import Original from '@w5-ui/svelte/components/DateRangePicker.svelte';
  import { withShadowStyles } from '../styled.ts';
  let {
    value = { start: null, end: null },
    placeholder = 'Select date range',
    disabled = false
  } = $props();
</script>

<Original {value} {placeholder} {disabled}>
  <slot />
</Original>
