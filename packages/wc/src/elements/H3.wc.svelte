<svelte:options customElement="uni-h3" />
<script>
  import Original from '@w5-ui/svelte/components/H3.svelte';
  let {
    class: className = ''
  } = $props();
</script>

<Original class={className}>
  <slot />
</Original>
