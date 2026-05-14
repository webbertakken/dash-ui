<script module lang="ts">
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
</script>

<script lang="ts">
  interface Props {
    columns: KanbanColumn[];
    onCardMove?: ((cardId: string, fromColId: string, toColId: string) => void) | undefined;
    ariaLabel?: string;
  }

  let { columns, onCardMove = undefined, ariaLabel = 'Kanban board' }: Props = $props();

  let announce = $state('');
  let grabbed: { cardId: string; colId: string } | null = $state(null);
  let dragSrc: { cardId: string; colId: string } | null = $state(null);
  let dragOverCol: string | null = $state(null);
  let cardRefs: Record<string, HTMLButtonElement> = $state({});

  const announceId = `kanban-announce-${Math.random().toString(36).slice(2, 9)}`;

  function say(msg: string) { announce = msg; }

  function colOf(cardId: string): KanbanColumn | undefined {
    return columns.find((c) => c.cards.some((k) => k.id === cardId));
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
      const idx = columns.findIndex((c) => c.id === grabbed!.colId);
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
    const card = colOf(dragSrc.cardId)?.cards.find((c) => c.id === dragSrc!.cardId);
    const toCol = columns.find((c) => c.id === toColId);
    onCardMove?.(dragSrc.cardId, dragSrc.colId, toColId);
    if (card && toCol) say(`Moved ${card.title} to ${toCol.title}.`);
    dragSrc = null;
    dragOverCol = null;
  }
</script>

<div role="region" aria-label={ariaLabel}>
  <span
    id={announceId}
    role="status"
    aria-live="assertive"
    aria-atomic="true"
    class="sr-only"
  >{announce}</span>

  <div class="flex gap-3 overflow-x-auto" role="list">
    {#each columns as col (col.id)}
      <div
        data-over={dragOverCol === col.id ? 'true' : undefined}
        role="listitem"
        class="flex min-w-[240px] flex-1 flex-col gap-2 rounded-lg border border-white/[0.06] bg-white/[0.02] p-2 data-[over=true]:border-brand-05/40 data-[over=true]:bg-brand-05/[0.04]"
        ondragover={(e) => handleDragOver(e, col.id)}
        ondragleave={() => { dragOverCol = null; }}
        ondrop={(e) => handleDrop(e, col.id)}
      >
        <div class="flex items-center gap-2 px-1 pt-0.5">
          {#if col.color}
            <span class="inline-block h-2 w-2 shrink-0 rounded-full" style="background:{col.color}" aria-hidden="true"></span>
          {/if}
          <span class="flex-1 text-12 font-semibold uppercase tracking-[0.05em] text-text-3">{col.title}</span>
          <span
            class="rounded bg-white/[0.06] px-1.5 py-0.5 text-11 text-[#6e7079] tabular-nums"
            aria-label={`${col.cards.length} card${col.cards.length !== 1 ? 's' : ''}`}
          >
            {col.cards.length}
          </span>
        </div>

        <ul class="m-0 flex list-none flex-col gap-1.5 p-0" aria-label={`${col.title} cards`}>
          {#each col.cards as card (col.id + '/' + card.id)}
            {@const isGrabbed = grabbed?.cardId === card.id}
            <li>
              <button
                bind:this={cardRefs[card.id]}
                type="button"
                draggable={true}
                aria-pressed={isGrabbed}
                aria-label={`${card.title}${card.subtitle ? `, ${card.subtitle}` : ''}${card.meta ? `, ${card.meta}` : ''}. ${isGrabbed ? 'Moving. Use arrow keys to change column, Space to drop, Escape to cancel.' : 'Press Space to move.'}`}
                data-grabbed={isGrabbed ? 'true' : undefined}
                class="flex w-full cursor-grab flex-col items-start gap-0.5 rounded-md border border-white/[0.06] bg-neutral-09 p-2 text-left active:cursor-grabbing hover:border-white/[0.12] data-[grabbed=true]:border-brand-05 data-[grabbed=true]:bg-brand-05/[0.08] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-05"
                onkeydown={(e) => handleKeyDown(e, card, col)}
                ondragstart={(e) => handleDragStart(e, card.id, col.id)}
                ondragend={() => { dragSrc = null; dragOverCol = null; }}
              >
                <span class="text-13 font-medium text-white">{card.title}</span>
                {#if card.subtitle}<span class="text-12 text-text-3">{card.subtitle}</span>{/if}
                {#if card.meta}<span class="text-11 text-[#6e7079]">{card.meta}</span>{/if}
              </button>
            </li>
          {/each}
          {#if col.cards.length === 0}
            <li class="rounded-md border border-dashed border-white/[0.06] p-3 text-center text-11 text-[#6e7079]" role="note" aria-label={`${col.title} is empty`}>Empty</li>
          {/if}
        </ul>
      </div>
    {/each}
  </div>
</div>
