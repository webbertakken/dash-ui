<svelte:options customElement="uni-stepper" />
<script>
  import Original from '@w5-ui/svelte/components/Stepper.svelte';
  let {
    steps = undefined,
    active = undefined,
    class: className = ''
  } = $props();
</script>

<Original {steps} {active} class={className}>
  <slot />
</Original>
