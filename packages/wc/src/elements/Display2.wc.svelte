<svelte:options customElement="uni-display2" />
<script>
  import Original from '@w5-ui/svelte/components/Display2.svelte';
  let {
    class: className = ''
  } = $props();
</script>

<Original class={className}>
  <slot />
</Original>
