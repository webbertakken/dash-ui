<svelte:options customElement="uni-submeta" />
<script>
  import Original from '@w5-ui/svelte/components/Submeta.svelte';
  let {
    class: className = ''
  } = $props();
</script>

<Original class={className}>
  <slot />
</Original>
