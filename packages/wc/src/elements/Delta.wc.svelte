<svelte:options customElement="uni-delta" />
<script>
  import Original from '@w5-ui/svelte/components/Delta.svelte';
  let {
    dir = undefined,
    class: className = ''
  } = $props();
</script>

<Original {dir} class={className}>
  <slot />
</Original>
