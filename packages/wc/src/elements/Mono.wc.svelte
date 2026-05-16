<svelte:options customElement="uni-mono" />
<script>
  import Original from '@w5-ui/svelte/components/Mono.svelte';
  let {
    class: className = ''
  } = $props();
</script>

<Original class={className}>
  <slot />
</Original>
