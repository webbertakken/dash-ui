<svelte:options customElement="uni-eyebrow" />
<script>
  import Original from '@w5-ui/svelte/components/Eyebrow.svelte';
  let {
    class: className = ''
  } = $props();
</script>

<Original class={className}>
  <slot />
</Original>
