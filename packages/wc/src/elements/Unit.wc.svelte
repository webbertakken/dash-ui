<svelte:options customElement="uni-unit" />
<script>
  import Original from '@w5-ui/svelte/components/Unit.svelte';
  let {
    class: className = ''
  } = $props();
</script>

<Original class={className}>
  <slot />
</Original>
