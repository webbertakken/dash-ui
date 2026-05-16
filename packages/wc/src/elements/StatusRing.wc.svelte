<svelte:options customElement="uni-status-ring" />
<script>
  import Original from '@w5-ui/svelte/components/StatusRing.svelte';
  let {
    class: className = '',
    style = ''
  } = $props();
</script>

<Original class={className} {style}>
  <slot />
</Original>
