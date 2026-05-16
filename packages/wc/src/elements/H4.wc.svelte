<svelte:options customElement="uni-h4" />
<script>
  import Original from '@w5-ui/svelte/components/H4.svelte';
  let {
    class: className = ''
  } = $props();
</script>

<Original class={className}>
  <slot />
</Original>
