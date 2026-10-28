<svelte:options customElement={{ tag: "uni-inline-edit", extend: withShadowStyles }} />
<script>
  import Original from '@w5-ui/svelte/components/InlineEdit.svelte';
  import { withShadowStyles } from '../styled.ts';
  let {
    value = undefined,
    label = undefined,
    placeholder = ''
  } = $props();
</script>

<Original {value} {label} {placeholder}>
  <slot />
</Original>
