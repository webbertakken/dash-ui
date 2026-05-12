<svelte:options tag="uni-kanban-board" />
<script>
  import Original from '@w5-ui/svelte/components/KanbanBoard.svelte';
  export let columns = undefined;
  export let onCardMove = undefined;
  export let ariaLabel = 'Kanban board';
</script>

<Original {columns} {onCardMove} {ariaLabel}>
  <slot />
</Original>
