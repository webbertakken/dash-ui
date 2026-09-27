<svelte:options customElement={{ tag: "uni-kanban-board", extend: withShadowStyles }} />
<script>
  import Original from '@w5-ui/svelte/components/KanbanBoard.svelte';
  import { withShadowStyles } from '../styled.ts';
  let {
    columns = undefined,
    ariaLabel = 'Kanban board'
  } = $props();
</script>

<Original {columns} {ariaLabel}>
  <slot />
</Original>
