<svelte:options customElement={{ tag: "uni-star-rating", extend: withShadowStyles }} />
<script>
  import Original from '@w5-ui/svelte/components/StarRating.svelte';
  import { withShadowStyles } from '../styled.ts';
  let {
    label = undefined,
    value = 0,
    max = 5,
    readOnly = false,
    size = 'md'
  } = $props();
</script>

<Original {label} {value} {max} {readOnly} {size}>
  <slot />
</Original>
