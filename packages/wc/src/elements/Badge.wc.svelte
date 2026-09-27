<svelte:options customElement={{ tag: "uni-badge", extend: withShadowStyles }} />
<script>
  import Original from '@w5-ui/svelte/components/Badge.svelte';
  import { withShadowStyles } from '../styled.ts';
  let {
    count = undefined,
    dot = false,
    max = 99,
    showZero = false,
    color = 'danger',
    class: klass = ''
  } = $props();
</script>

<Original {count} {dot} {max} {showZero} {color} class={klass}>
  <slot />
</Original>
