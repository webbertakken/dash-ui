import { useId, useRef, useState } from 'react';

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

export interface KanbanBoardProps {
  columns: KanbanColumn[];
  onCardMove?: (cardId: string, fromColumnId: string, toColumnId: string) => void;
  ariaLabel?: string;
}

export function KanbanBoard({ columns, onCardMove, ariaLabel = 'Kanban board' }: KanbanBoardProps) {
  const announceId = useId();
  const [announce, setAnnounce] = useState('');
  const [grabbed, setGrabbed] = useState<{ cardId: string; colId: string } | null>(null);
  const [dragSrc, setDragSrc] = useState<{ cardId: string; colId: string } | null>(null);
  const [dragOverCol, setDragOverCol] = useState<string | null>(null);
  const cardRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  function say(msg: string) { setAnnounce(msg); }

  function colOf(cardId: string): KanbanColumn | undefined {
    return columns.find(c => c.cards.some(k => k.id === cardId));
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLButtonElement>, card: KanbanCard, col: KanbanColumn) {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      if (grabbed?.cardId === card.id) {
        setGrabbed(null);
        say(`Dropped ${card.title} in ${col.title}.`);
      } else {
        setGrabbed({ cardId: card.id, colId: col.id });
        say(`Picked up ${card.title} from ${col.title}. Use left/right arrows to move between columns, Space to drop, Escape to cancel.`);
      }
    } else if (e.key === 'Escape' && grabbed?.cardId === card.id) {
      e.preventDefault();
      setGrabbed(null);
      say('Move cancelled.');
    } else if ((e.key === 'ArrowLeft' || e.key === 'ArrowRight') && grabbed?.cardId === card.id) {
      e.preventDefault();
      const idx = columns.findIndex(c => c.id === grabbed.colId);
      const nextIdx = e.key === 'ArrowLeft' ? idx - 1 : idx + 1;
      if (nextIdx < 0 || nextIdx >= columns.length) return;
      const nextCol = columns[nextIdx];
      onCardMove?.(card.id, grabbed.colId, nextCol.id);
      setGrabbed({ cardId: card.id, colId: nextCol.id });
      say(`Moved ${card.title} to ${nextCol.title}.`);
      setTimeout(() => { cardRefs.current[card.id]?.focus(); }, 0);
    }
  }

  function handleDragStart(e: React.DragEvent, cardId: string, colId: string) {
    e.dataTransfer.effectAllowed = 'move';
    setDragSrc({ cardId, colId });
  }

  function handleDrop(e: React.DragEvent, toColId: string) {
    e.preventDefault();
    if (!dragSrc || dragSrc.colId === toColId) return;
    const card = colOf(dragSrc.cardId)?.cards.find(c => c.id === dragSrc.cardId);
    const toCol = columns.find(c => c.id === toColId);
    onCardMove?.(dragSrc.cardId, dragSrc.colId, toColId);
    if (card && toCol) say(`Moved ${card.title} to ${toCol.title}.`);
    setDragSrc(null);
    setDragOverCol(null);
  }

  return (
    <div className="kanban" role="region" aria-label={ariaLabel}>
      <span
        id={announceId}
        role="status"
        aria-live="assertive"
        aria-atomic="true"
        className="sr-only"
      >
        {announce}
      </span>

      <div className="kanban-board" role="list">
        {columns.map(col => (
          <div
            key={col.id}
            className={`kanban-col${dragOverCol === col.id ? ' kanban-col--over' : ''}`}
            role="listitem"
            onDragOver={e => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; setDragOverCol(col.id); }}
            onDragLeave={() => setDragOverCol(null)}
            onDrop={e => handleDrop(e, col.id)}
          >
            <div className="kanban-col-header">
              {col.color && <span className="kanban-col-dot" style={{ background: col.color }} aria-hidden="true" />}
              <span className="kanban-col-title">{col.title}</span>
              <span className="kanban-col-count" aria-label={`${col.cards.length} card${col.cards.length !== 1 ? 's' : ''}`}>
                {col.cards.length}
              </span>
            </div>
            <ul className="kanban-cards" aria-label={`${col.title} cards`}>
              {col.cards.map(card => {
                const isGrabbed = grabbed?.cardId === card.id;
                return (
                  <li key={card.id} className={`kanban-card-item${isGrabbed ? ' is-grabbed' : ''}`}>
                    <button
                      ref={el => { cardRefs.current[card.id] = el; }}
                      type="button"
                      className="kanban-card"
                      draggable
                      aria-pressed={isGrabbed}
                      aria-label={`${card.title}${card.subtitle ? `, ${card.subtitle}` : ''}${card.meta ? `, ${card.meta}` : ''}. ${isGrabbed ? 'Moving. Use arrow keys to change column, Space to drop, Escape to cancel.' : 'Press Space to move.'}`}
                      onKeyDown={e => handleKeyDown(e, card, col)}
                      onDragStart={e => handleDragStart(e, card.id, col.id)}
                      onDragEnd={() => { setDragSrc(null); setDragOverCol(null); }}
                    >
                      <span className="kanban-card-title">{card.title}</span>
                      {card.subtitle && <span className="kanban-card-sub">{card.subtitle}</span>}
                      {card.meta && <span className="kanban-card-meta">{card.meta}</span>}
                    </button>
                  </li>
                );
              })}
              {col.cards.length === 0 && (
                <li className="kanban-empty" role="note" aria-label={`${col.title} is empty`}>
                  Empty
                </li>
              )}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
