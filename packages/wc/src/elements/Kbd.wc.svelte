<svelte:options customElement="uni-kbd" />
<script>
  import Original from '@w5-ui/svelte/components/Kbd.svelte';
  let {
    keys = undefined,
    class: className = ''
  } = $props();
</script>

<Original {keys} class={className}>
  <slot />
</Original>
