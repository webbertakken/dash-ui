<svelte:options customElement="uni-tag" />
<script>
  import Original from '@w5-ui/svelte/components/Tag.svelte';
  let {
    label = undefined,
    class: className = ''
  } = $props();
</script>

<Original {label} class={className}>
  <slot />
</Original>
