<svelte:options customElement="uni-breadcrumb" />
<script>
  import Original from '@w5-ui/svelte/components/Breadcrumb.svelte';
  let {
    items = [],
    class: className = ''
  } = $props();
</script>

<Original {items} class={className}>
  <slot />
</Original>
