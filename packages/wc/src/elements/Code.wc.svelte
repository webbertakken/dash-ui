<svelte:options customElement="uni-code" />
<script>
  import Original from '@w5-ui/svelte/components/Code.svelte';
  let {
    class: className = ''
  } = $props();
</script>

<Original class={className}>
  <slot />
</Original>
