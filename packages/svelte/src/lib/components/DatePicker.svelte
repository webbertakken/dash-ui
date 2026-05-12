<script module lang="ts">
  let counter = 0;
  const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  function isSameDay(a: Date, b: Date) {
    return a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate();
  }

  function formatDate(d: Date) {
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${mm}/${dd}/${d.getFullYear()}`;
  }

  function buildGrid(year: number, month: number): Date[] {
    const first = new Date(year, month, 1);
    const last = new Date(year, month + 1, 0);
    const grid: Date[] = [];
    for (let i = first.getDay() - 1; i >= 0; i--) {
      grid.push(new Date(year, month, -i));
    }
    for (let d = 1; d <= last.getDate(); d++) {
      grid.push(new Date(year, month, d));
    }
    while (grid.length < 42) {
      grid.push(new Date(year, month + 1, grid.length - first.getDay() - last.getDate() + 1));
    }
    return grid;
  }
</script>

<script lang="ts">
  import { onMount, onDestroy, tick } from 'svelte';

  interface Props {
    value?: Date | null;
    placeholder?: string;
    disabled?: boolean;
    onchange?: (payload: Date) => void;
  }

  let { value = null, placeholder = 'Pick a date', disabled = false,
    onchange,
  }: Props = $props();
  const uid = `dash-ui-dp-${++counter}`;
  const calId = `${uid}-cal`;
  const today = new Date();

  let open = $state(false);
  // svelte-ignore state_referenced_locally
  let viewYear = $state(value?.getFullYear() ?? today.getFullYear());
  // svelte-ignore state_referenced_locally
  let viewMonth = $state(value?.getMonth() ?? today.getMonth());
  let focusIdx = $state(0);
  let triggerEl = $state<HTMLButtonElement | undefined>(undefined);
  let calEl = $state<HTMLDivElement | undefined>(undefined);
  let dayEls: (HTMLButtonElement | null)[] = $state(Array(42).fill(null));

  let grid = $derived(buildGrid(viewYear, viewMonth));
  let label = $derived(`${MONTHS[viewMonth]} ${viewYear}`);

  function openCal() {
    if (disabled) return;
    const initial = value
      ? grid.findIndex((d) => isSameDay(d, value!))
      : grid.findIndex((d) => isSameDay(d, today));
    focusIdx = Math.max(0, initial);
    open = true;
    tick().then(() => dayEls[focusIdx]?.focus());
  }

  function closeCal() {
    open = false;
    triggerEl?.focus();
  }

  function select(d: Date) {
    onchange?.(d);
    closeCal();
  }

  function prevMonth() {
    if (viewMonth === 0) { viewYear -= 1; viewMonth = 11; }
    else viewMonth -= 1;
    tick().then(() => dayEls[focusIdx]?.focus());
  }

  function nextMonth() {
    if (viewMonth === 11) { viewYear += 1; viewMonth = 0; }
    else viewMonth += 1;
    tick().then(() => dayEls[focusIdx]?.focus());
  }

  function onGridKey(e: KeyboardEvent, idx: number) {
    let next = idx;
    if (e.key === 'ArrowRight') { e.preventDefault(); next = idx + 1; }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); next = idx - 1; }
    else if (e.key === 'ArrowDown') { e.preventDefault(); next = idx + 7; }
    else if (e.key === 'ArrowUp') { e.preventDefault(); next = idx - 7; }
    else if (e.key === 'Home') { e.preventDefault(); next = Math.floor(idx / 7) * 7; }
    else if (e.key === 'End') { e.preventDefault(); next = Math.floor(idx / 7) * 7 + 6; }
    else if (e.key === 'PageDown') { e.preventDefault(); nextMonth(); return; }
    else if (e.key === 'PageUp') { e.preventDefault(); prevMonth(); return; }
    else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); select(grid[idx]); return; }
    else if (e.key === 'Escape') { e.preventDefault(); closeCal(); return; }
    else if (e.key === 'Tab') { closeCal(); return; }
    else return;
    if (next < 0) { prevMonth(); return; }
    if (next >= grid.length) { nextMonth(); return; }
    focusIdx = next;
    tick().then(() => dayEls[focusIdx]?.focus());
  }

  function handleOutside(e: MouseEvent) {
    if (open && !calEl?.contains(e.target as Node) && !triggerEl?.contains(e.target as Node)) {
      open = false;
    }
  }

  onMount(() => document.addEventListener('mousedown', handleOutside));
  onDestroy(() => document.removeEventListener('mousedown', handleOutside));
</script>

<div class="dp-root">
  <button
    bind:this={triggerEl}
    type="button"
    class="btn dp-trigger"
    aria-haspopup="dialog"
    aria-expanded={open}
    aria-controls={open ? calId : undefined}
    {disabled}
    onclick={() => open ? closeCal() : openCal()}
  >
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
      <rect x="1" y="2" width="12" height="11" rx="1.5" />
      <path d="M1 6h12M4 1v2M10 1v2" />
    </svg>
    {value ? formatDate(value) : placeholder}
  </button>

  {#if open}
    <div
      id={calId}
      bind:this={calEl}
      role="dialog"
      aria-modal="true"
      aria-label={`Choose date, ${label}`}
      class="dp-cal"
    >
      <div class="dp-header">
        <button type="button" class="dp-nav" onclick={prevMonth} aria-label="Previous month">
          <svg width="8" height="12" viewBox="0 0 8 12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
            <path d="M7 1L2 6l5 5" />
          </svg>
        </button>
        <span class="dp-month-label" aria-live="polite">{label}</span>
        <button type="button" class="dp-nav" onclick={nextMonth} aria-label="Next month">
          <svg width="8" height="12" viewBox="0 0 8 12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
            <path d="M1 1l5 5-5 5" />
          </svg>
        </button>
      </div>

      <table role="grid" class="dp-grid" aria-label={label}>
        <thead>
          <tr>
            {#each DAYS as d}
              <th scope="col" abbr={d}>{d}</th>
            {/each}
          </tr>
        </thead>
        <tbody>
          {#each Array(6) as _, row}
            <tr>
              {#each Array(7) as _, col}
                {@const idx = row * 7 + col}
                {@const day = grid[idx]}
                {@const outside = day.getMonth() !== viewMonth}
                {@const isToday = isSameDay(day, today)}
                {@const isSelected = value ? isSameDay(day, value) : false}
                <td role="gridcell" aria-selected={isSelected}>
                  <button
                    bind:this={dayEls[idx]}
                    type="button"
                    tabindex={idx === focusIdx ? 0 : -1}
                    class="dp-day{outside ? ' dp-day--outside' : ''}{isToday && !isSelected ? ' dp-day--today' : ''}{isSelected ? ' dp-day--selected' : ''}"
                    aria-label={day.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                    onkeydown={(e) => onGridKey(e, idx)}
                    onclick={() => select(day)}
                  >
                    {day.getDate()}
                  </button>
                </td>
              {/each}
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/if}
</div>
