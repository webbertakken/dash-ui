<svelte:options customElement="uni-word-cloud" />
<script>
  import Original from '@w5-ui/svelte/components/WordCloud.svelte';
  let {
    items = [],
    height = 160,
    ariaLabel = 'Word cloud'
  } = $props();
</script>

<Original {items} {height} {ariaLabel}>
  <slot />
</Original>
