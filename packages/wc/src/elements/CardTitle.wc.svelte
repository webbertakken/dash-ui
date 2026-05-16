<svelte:options customElement="uni-card-title" />
<script>
  import Original from '@w5-ui/svelte/components/CardTitle.svelte';
  let {
    class: className = ''
  } = $props();
</script>

<Original class={className}>
  <slot />
</Original>
