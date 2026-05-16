<svelte:options customElement="uni-muted" />
<script>
  import Original from '@w5-ui/svelte/components/Muted.svelte';
  let {
    class: className = ''
  } = $props();
</script>

<Original class={className}>
  <slot />
</Original>
