<svelte:options customElement="uni-h2" />
<script>
  import Original from '@w5-ui/svelte/components/H2.svelte';
  let {
    class: className = ''
  } = $props();
</script>

<Original class={className}>
  <slot />
</Original>
