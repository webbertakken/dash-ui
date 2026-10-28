<svelte:options customElement={{ tag: "uni-date-picker", extend: withShadowStyles }} />
<script>
  import Original from '@w5-ui/svelte/components/DatePicker.svelte';
  import { withShadowStyles } from '../styled.ts';
  let {
    value = null,
    placeholder = 'Pick a date',
    disabled = false
  } = $props();
</script>

<Original {value} {placeholder} {disabled}>
  <slot />
</Original>
