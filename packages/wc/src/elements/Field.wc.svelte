<svelte:options customElement={{ tag: "uni-field", extend: withShadowStyles }} />
<script>
  import Original from '@w5-ui/svelte/components/Field.svelte';
  import { withShadowStyles } from '../styled.ts';
  let {
    label = undefined,
    value = '',
    id = undefined,
    error = undefined,
    required = false,
    hint = undefined
  } = $props();
</script>

<Original {label} {value} {id} {error} {required} {hint}>
  <slot />
</Original>
