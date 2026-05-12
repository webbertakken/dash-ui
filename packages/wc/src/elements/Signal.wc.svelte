<svelte:options customElement="uni-signal" />
<script>
  import Original from '@w5-ui/svelte/components/Signal.svelte';
  let {
    weak = false,
    label = undefined
  } = $props();
</script>

<Original {weak} {label}>
  <slot />
</Original>
