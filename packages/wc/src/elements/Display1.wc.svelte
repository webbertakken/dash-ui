<svelte:options customElement="uni-display1" />
<script>
  import Original from '@w5-ui/svelte/components/Display1.svelte';
  let {
    class: className = ''
  } = $props();
</script>

<Original class={className}>
  <slot />
</Original>
