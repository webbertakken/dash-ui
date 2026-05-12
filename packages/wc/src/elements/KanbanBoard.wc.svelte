<svelte:options customElement="uni-kanban-board" />
<script>
  import Original from '@w5-ui/svelte/components/KanbanBoard.svelte';
  let {
    columns = undefined,
    ariaLabel = 'Kanban board'
  } = $props();
</script>

<Original {columns} {ariaLabel}>
  <slot />
</Original>
