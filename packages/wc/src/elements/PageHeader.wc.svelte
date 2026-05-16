<svelte:options customElement="uni-page-header" />
<script>
  import Original from '@w5-ui/svelte/components/PageHeader.svelte';
  let {
    title = undefined,
    sticky = true,
    class: className = ''
  } = $props();
</script>

<Original {title} {sticky} class={className}>
  <slot />
</Original>
