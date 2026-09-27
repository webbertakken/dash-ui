<svelte:options customElement={{ tag: "uni-count-up", extend: withShadowStyles }} />
<script>
  import Original from '@w5-ui/svelte/components/CountUp.svelte';
  import { withShadowStyles } from '../styled.ts';
  let {
    from = 0,
    to = undefined,
    duration = 1200,
    decimals = 0,
    prefix = '',
    suffix = '',
    separator = ',',
    class: klass = ''
  } = $props();
</script>

<Original {from} {to} {duration} {decimals} {prefix} {suffix} {separator} class={klass}>
  <slot />
</Original>
