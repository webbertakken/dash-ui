<svelte:options customElement="uni-caption" />
<script>
  import Original from '@w5-ui/svelte/components/Caption.svelte';
  let {
    class: className = ''
  } = $props();
</script>

<Original class={className}>
  <slot />
</Original>
