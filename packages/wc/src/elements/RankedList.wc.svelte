<svelte:options customElement="uni-ranked-list" />
<script>
  import Original from '@w5-ui/svelte/components/RankedList.svelte';
  let {
    items = undefined,
    unit = undefined,
    max = undefined,
    ariaLabel = 'Ranked list'
  } = $props();
</script>

<Original {items} {unit} {max} {ariaLabel}>
  <slot />
</Original>
