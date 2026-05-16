<svelte:options customElement="uni-label" />
<script>
  import Original from '@w5-ui/svelte/components/Label.svelte';
  let {
    class: className = ''
  } = $props();
</script>

<Original class={className}>
  <slot />
</Original>
