<svelte:options tag="uni-word-cloud" />
<script>
  import Original from '@w5-ui/svelte/components/WordCloud.svelte';
  export let items = [];
  export let height = 160;
  export let ariaLabel = 'Word cloud';
</script>

<Original {items} {height} {ariaLabel}>
  <slot />
</Original>
