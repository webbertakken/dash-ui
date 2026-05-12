<svelte:options customElement="uni-contextual-help" />
<script>
  import Original from '@w5-ui/svelte/components/ContextualHelp.svelte';
  let {
    title = undefined,
    body = undefined,
    placement = 'top'
  } = $props();
</script>

<Original {title} {body} {placement}>
  <slot />
</Original>
