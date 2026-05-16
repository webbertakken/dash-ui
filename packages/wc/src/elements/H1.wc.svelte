<svelte:options customElement="uni-h1" />
<script>
  import Original from '@w5-ui/svelte/components/H1.svelte';
  let {
    class: className = ''
  } = $props();
</script>

<Original class={className}>
  <slot />
</Original>
