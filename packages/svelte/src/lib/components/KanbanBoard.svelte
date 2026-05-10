<script lang="ts">
  export interface KanbanCard {
    id: string;
    title: string;
    subtitle?: string;
    meta?: string;
  }

  export interface KanbanColumn {
    id: string;
    title: string;
    color?: string;
    cards: KanbanCard[];
  }

  export let columns: KanbanColumn[];
  export let onCardMove: ((cardId: string, fromColId: string, toColId: string) => void) | undefined = undefined;
  export let ariaLabel: string = 'Kanban board';

  let announce = '';
  let grabbed: { cardId: string; colId: string } | null = null;
  let dragSrc: { cardId: string; colId: string } | null = null;
  let dragOverCol: string | null = null;
  let cardRefs: Record<string, HTMLButtonElement> = {};

  const announceId = `kanban-announce-${Math.random().toString(36).slice(2, 9)}`;

  function say(msg: string) { announce = msg; }

  function colOf(cardId: string): KanbanColumn | undefined {
    return columns.find(c => c.cards.some(k => k.id === cardId));
  }

  function handleKeyDown(e: KeyboardEvent, card: KanbanCard, col: KanbanColumn) {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      if (grabbed?.cardId === card.id) {
        grabbed = null;
        say(`Dropped ${card.title} in ${col.title}.`);
      } else {
        grabbed = { cardId: card.id, colId: col.id };
        say(`Picked up ${card.title} from ${col.title}. Use left/right arrows to move between columns, Space to drop, Escape to cancel.`);
      }
    } else if (e.key === 'Escape' && grabbed?.cardId === card.id) {
      e.preventDefault();
      grabbed = null;
      say('Move cancelled.');
    } else if ((e.key === 'ArrowLeft' || e.key === 'ArrowRight') && grabbed?.cardId === card.id) {
      e.preventDefault();
      const idx = columns.findIndex(c => c.id === grabbed!.colId);
      const nextIdx = e.key === 'ArrowLeft' ? idx - 1 : idx + 1;
      if (nextIdx < 0 || nextIdx >= columns.length) return;
      const nextCol = columns[nextIdx];
      onCardMove?.(card.id, grabbed!.colId, nextCol.id);
      grabbed = { cardId: card.id, colId: nextCol.id };
      say(`Moved ${card.title} to ${nextCol.title}.`);
      setTimeout(() => { cardRefs[card.id]?.focus(); }, 0);
    }
  }

  function handleDragStart(e: DragEvent, cardId: string, colId: string) {
    if (e.dataTransfer) e.dataTransfer.effectAllowed = 'move';
    dragSrc = { cardId, colId };
  }

  function handleDragOver(e: DragEvent, colId: string) {
    e.preventDefault();
    if (e.dataTransfer) e.dataTransfer.dropEffect = 'move';
    dragOverCol = colId;
  }

  function handleDrop(e: DragEvent, toColId: string) {
    e.preventDefault();
    if (!dragSrc || dragSrc.colId === toColId) { dragSrc = null; dragOverCol = null; return; }
    const card = colOf(dragSrc.cardId)?.cards.find(c => c.id === dragSrc!.cardId);
    const toCol = columns.find(c => c.id === toColId);
    onCardMove?.(dragSrc.cardId, dragSrc.colId, toColId);
    if (card && toCol) say(`Moved ${card.title} to ${toCol.title}.`);
    dragSrc = null;
    dragOverCol = null;
  }
</script>

<div class="kanban" role="region" aria-label={ariaLabel}>
  <span
    id={announceId}
    role="status"
    aria-live="assertive"
    aria-atomic="true"
    class="sr-only"
  >{announce}</span>

  <div class="kanban-board" role="list">
    {#each columns as col (col.id)}
      <div
        class="kanban-col"
        class:kanban-col--over={dragOverCol === col.id}
        role="listitem"
        on:dragover={e => handleDragOver(e, col.id)}
        on:dragleave={() => { dragOverCol = null; }}
        on:drop={e => handleDrop(e, col.id)}
      >
        <div class="kanban-col-header">
          {#if col.color}
            <span class="kanban-col-dot" style="background:{col.color}" aria-hidden="true" />
          {/if}
          <span class="kanban-col-title">{col.title}</span>
          <span class="kanban-col-count" aria-label="{col.cards.length} card{col.cards.length !== 1 ? 's' : ''}">
            {col.cards.length}
          </span>
        </div>

        <ul class="kanban-cards" aria-label="{col.title} cards">
          {#each col.cards as card (card.id)}
            {@const isGrabbed = grabbed?.cardId === card.id}
            <li class="kanban-card-item" class:is-grabbed={isGrabbed}>
              <button
                bind:this={cardRefs[card.id]}
                type="button"
                class="kanban-card"
                draggable={true}
                aria-pressed={isGrabbed}
                aria-label="{card.title}{card.subtitle ? `, ${card.subtitle}` : ''}{card.meta ? `, ${card.meta}` : ''}. {isGrabbed ? 'Moving. Use arrow keys to change column, Space to drop, Escape to cancel.' : 'Press Space to move.'}"
                on:keydown={e => handleKeyDown(e, card, col)}
                on:dragstart={e => handleDragStart(e, card.id, col.id)}
                on:dragend={() => { dragSrc = null; dragOverCol = null; }}
              >
                <span class="kanban-card-title">{card.title}</span>
                {#if card.subtitle}<span class="kanban-card-sub">{card.subtitle}</span>{/if}
                {#if card.meta}<span class="kanban-card-meta">{card.meta}</span>{/if}
              </button>
            </li>
          {/each}
          {#if col.cards.length === 0}
            <li class="kanban-empty" role="note" aria-label="{col.title} is empty">Empty</li>
          {/if}
        </ul>
      </div>
    {/each}
  </div>
</div>
