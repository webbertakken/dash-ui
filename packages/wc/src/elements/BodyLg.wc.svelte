<svelte:options customElement="uni-body-lg" />
<script>
  import Original from '@w5-ui/svelte/components/BodyLg.svelte';
  let {
    class: className = ''
  } = $props();
</script>

<Original class={className}>
  <slot />
</Original>
