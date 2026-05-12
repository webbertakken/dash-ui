<svelte:options customElement="uni-row-toggle" />
<script>
  import Original from '@w5-ui/svelte/components/RowToggle.svelte';
  let {
    title = undefined,
    description = undefined,
    on = false
  } = $props();
</script>

<Original {title} {description} {on}>
  <slot />
</Original>
