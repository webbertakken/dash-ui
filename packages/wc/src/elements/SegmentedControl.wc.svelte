<svelte:options customElement={{ tag: "uni-segmented-control", extend: withShadowStyles }} />
<script>
  import Original from '@w5-ui/svelte/components/SegmentedControl.svelte';
  import { withShadowStyles } from '../styled.ts';
  let {
    label = undefined,
    options = [],
    value = options[0]?.value ?? ''
  } = $props();
</script>

<Original {label} {options} {value}>
  <slot />
</Original>
