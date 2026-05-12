<svelte:options customElement="uni-skip-link" />
<script>
  import Original from '@w5-ui/svelte/components/SkipLink.svelte';
  let {
    href = '#main-content',
    class: className = ''
  } = $props();
</script>

<Original {href} class={className}>
  <slot />
</Original>
