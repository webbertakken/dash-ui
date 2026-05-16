<svelte:options customElement="uni-stat-number" />
<script>
  import Original from '@w5-ui/svelte/components/StatNumber.svelte';
  let {
    class: className = ''
  } = $props();
</script>

<Original class={className}>
  <slot />
</Original>
