<svelte:options customElement="uni-body" />
<script>
  import Original from '@w5-ui/svelte/components/Body.svelte';
  let {
    class: className = ''
  } = $props();
</script>

<Original class={className}>
  <slot />
</Original>
