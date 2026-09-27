<svelte:options customElement={{ tag: "uni-checkbox", extend: withShadowStyles }} />
<script>
  import Original from '@w5-ui/svelte/components/Checkbox.svelte';
  import { withShadowStyles } from '../styled.ts';
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
