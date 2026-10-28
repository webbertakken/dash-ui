<svelte:options customElement={{ tag: "uni-row-toggle", extend: withShadowStyles }} />
<script>
  import Original from '@w5-ui/svelte/components/RowToggle.svelte';
  import { withShadowStyles } from '../styled.ts';
  let {
    title = undefined,
    description = undefined,
    on = false
  } = $props();
</script>

<Original {title} {description} {on}>
  <slot />
</Original>
