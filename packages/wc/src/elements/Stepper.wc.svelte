<svelte:options customElement={{ tag: "uni-stepper", extend: withShadowStyles }} />
<script>
  import Original from '@w5-ui/svelte/components/Stepper.svelte';
  import { withShadowStyles } from '../styled.ts';
  let {
    steps = undefined,
    active = undefined,
    class: className = ''
  } = $props();
</script>

<Original {steps} {active} class={className}>
  <slot />
</Original>
