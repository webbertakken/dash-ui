<svelte:options customElement="uni-mac" />
<script>
  import Original from '@w5-ui/svelte/components/Mac.svelte';
  let {
    class: className = ''
  } = $props();
</script>

<Original class={className}>
  <slot />
</Original>
