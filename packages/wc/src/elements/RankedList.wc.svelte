<svelte:options tag="uni-ranked-list" />
<script>
  import Original from '@w5-ui/svelte/components/RankedList.svelte';
  export let items = undefined;
  export let unit = undefined;
  export let max = undefined;
  export let ariaLabel = 'Ranked list';
</script>

<Original {items} {unit} {max} {ariaLabel}>
  <slot />
</Original>
