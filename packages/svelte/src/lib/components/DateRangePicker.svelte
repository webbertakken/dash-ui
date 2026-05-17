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

  export interface DateRange {
    start: Date | null;
    end: Date | null;
  }
</script>

<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import Button from './Button.svelte';

  interface Props {
    value?: DateRange;
    placeholder?: string;
    disabled?: boolean;
    onchange?: (payload: DateRange) => void;
  }

  let {
    value = { start: null, end: null },
    placeholder = 'Select date range',
    disabled = false,
    onchange,
  }: Props = $props();
  const uid = `dash-ui-drp-${++counter}`;
  const dlgId = `${uid}-dlg`;
  const today = new Date();

  let open = $state(false);
  let picking: Date | null = $state(null);
  let hoverDate: Date | null = $state(null);
  let viewYear = $state(today.getFullYear());
  let viewMonth = $state(today.getMonth());
  let triggerEl = $state<HTMLDivElement | undefined>(undefined);
  let dlgEl = $state<HTMLDivElement | undefined>(undefined);

  let rightMonth = $derived(viewMonth === 11 ? 0 : viewMonth + 1);
  let rightYear = $derived(viewMonth === 11 ? viewYear + 1 : viewYear);
  let leftGrid = $derived(buildGrid(viewYear, viewMonth));
  let rightGrid = $derived(buildGrid(rightYear, rightMonth));

  function prevMonth() {
    if (viewMonth === 0) { viewYear -= 1; viewMonth = 11; }
    else viewMonth -= 1;
  }

  function nextMonth() {
    if (viewMonth === 11) { viewYear += 1; viewMonth = 0; }
    else viewMonth += 1;
  }

  function handleDayClick(day: Date) {
    if (!picking) {
      picking = day;
      onchange?.({ start: day, end: null });
    } else {
      const [s, e] = day < picking ? [day, picking] : [picking, day];
      picking = null;
      hoverDate = null;
      onchange?.({ start: s, end: e });
      open = false;
    }
  }

  function isInRange(day: Date): boolean {
    const start = picking ?? value.start;
    const end = picking ? hoverDate : value.end;
    if (!start || !end) return false;
    const lo = start < end ? start : end;
    const hi = start < end ? end : start;
    return day > lo && day < hi;
  }

  function isStart(day: Date): boolean {
    const start = picking ?? value.start;
    return start ? isSameDay(day, start) : false;
  }

  function isEnd(day: Date): boolean {
    if (picking) return hoverDate ? isSameDay(day, hoverDate) : false;
    return value.end ? isSameDay(day, value.end) : false;
  }

  function formatRange(): string | null {
    if (!value.start) return null;
    if (!value.end) return `${formatDate(value.start)} --`;
    return `${formatDate(value.start)} -- ${formatDate(value.end)}`;
  }

  function handleOutside(e: MouseEvent) {
    if (open && !dlgEl?.contains(e.target as Node) && !triggerEl?.contains(e.target as Node)) {
      open = false;
      picking = null;
    }
  }

  onMount(() => document.addEventListener('mousedown', handleOutside));
  onDestroy(() => document.removeEventListener('mousedown', handleOutside));

  function dayCls(outside: boolean, isTodayDay: boolean, start: boolean, end: boolean, inRange: boolean) {
    let cls = 'flex h-8 w-8 cursor-pointer items-center justify-center rounded border-0 bg-transparent text-12 leading-none transition-colors duration-100 hover:bg-row-active focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-brand-05';
    if (outside) cls += ' text-text-4';
    else cls += ' text-text-2';
    if (isTodayDay && !start && !end) cls += ' ring-1 ring-inset ring-brand-05';
    if (start || end) cls += ' bg-brand-05 text-white hover:bg-brand-06';
    else if (inRange) cls += ' bg-brand-05/20 text-text-1';
    return cls;
  }

  const NAV_BTN =
    'inline-flex h-7 w-7 cursor-pointer items-center justify-center rounded border-0 bg-transparent text-text-4 hover:bg-row-hover hover:text-text-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-05';
</script>

<div class="relative inline-block" bind:this={triggerEl}>
  <Button variant="ghost" aria-haspopup="dialog" aria-expanded={open} aria-controls={open ? dlgId : undefined} disabled={disabled} onclick={() => { if (open) { open = false; picking = null; } else open = true; }}>
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
      <rect x="1" y="2" width="12" height="11" rx="1.5" />
      <path d="M1 6h12M4 1v2M10 1v2" />
    </svg>
    {formatRange() ?? placeholder}
  </Button>

  {#if open}
    <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
    <div
      id={dlgId}
      bind:this={dlgEl}
      role="dialog"
      aria-modal="true"
      aria-label="Select date range"
      tabindex={-1}
      class="absolute left-0 top-[calc(100%+4px)] z-[9100] rounded-lg border border-border-3 bg-bg-2 p-2 shadow-[0_8px_24px_rgba(0,0,0,0.5)]"
      onkeydown={(e) => {
        if (e.key === 'Escape') { e.preventDefault(); open = false; picking = null; }
      }}
    >
      <div class="flex gap-3">
        <!-- Left calendar -->
        <div>
          <div class="flex items-center justify-between px-1 py-1">
            <button type="button" class={NAV_BTN} onclick={prevMonth} aria-label="Previous month">
              <svg width="8" height="12" viewBox="0 0 8 12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
                <path d="M7 1L2 6l5 5" />
              </svg>
            </button>
            <span class="text-13 font-medium text-text-1" aria-live="polite">{MONTHS[viewMonth]} {viewYear}</span>
            <span class="inline-block w-7" aria-hidden="true"></span>
          </div>
          <table role="grid" class="mt-1 border-collapse" aria-label={`${MONTHS[viewMonth]} ${viewYear}`}>
            <thead>
              <tr>{#each DAYS as d}<th scope="col" abbr={d} class="p-0 text-center text-11 font-semibold uppercase tracking-[0.05em] text-text-4">{d}</th>{/each}</tr>
            </thead>
            <tbody>
              {#each Array(6) as _, row}
                <tr>
                  {#each Array(7) as _, col}
                    {@const idx = row * 7 + col}
                    {@const day = leftGrid[idx]}
                    {@const outside = day.getMonth() !== viewMonth}
                    {@const isTodayDay = isSameDay(day, today)}
                    {@const start = isStart(day)}
                    {@const end = isEnd(day)}
                    {@const inRange = isInRange(day)}
                    <td role="gridcell" aria-selected={start || end} class="p-0">
                      <button
                        type="button"
                        class={dayCls(outside, isTodayDay, start, end, inRange)}
                        aria-label={day.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                        onclick={() => handleDayClick(day)}
                        onmouseenter={() => { if (picking) hoverDate = day; }}
                        onmouseleave={() => { if (picking) hoverDate = null; }}
                      >{day.getDate()}</button>
                    </td>
                  {/each}
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
        <!-- Right calendar -->
        <div>
          <div class="flex items-center justify-between px-1 py-1">
            <span class="inline-block w-7" aria-hidden="true"></span>
            <span class="text-13 font-medium text-text-1" aria-live="polite">{MONTHS[rightMonth]} {rightYear}</span>
            <button type="button" class={NAV_BTN} onclick={nextMonth} aria-label="Next month">
              <svg width="8" height="12" viewBox="0 0 8 12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
                <path d="M1 1l5 5-5 5" />
              </svg>
            </button>
          </div>
          <table role="grid" class="mt-1 border-collapse" aria-label={`${MONTHS[rightMonth]} ${rightYear}`}>
            <thead>
              <tr>{#each DAYS as d}<th scope="col" abbr={d} class="p-0 text-center text-11 font-semibold uppercase tracking-[0.05em] text-text-4">{d}</th>{/each}</tr>
            </thead>
            <tbody>
              {#each Array(6) as _, row}
                <tr>
                  {#each Array(7) as _, col}
                    {@const idx = row * 7 + col}
                    {@const day = rightGrid[idx]}
                    {@const outside = day.getMonth() !== rightMonth}
                    {@const isTodayDay = isSameDay(day, today)}
                    {@const start = isStart(day)}
                    {@const end = isEnd(day)}
                    {@const inRange = isInRange(day)}
                    <td role="gridcell" aria-selected={start || end} class="p-0">
                      <button
                        type="button"
                        class={dayCls(outside, isTodayDay, start, end, inRange)}
                        aria-label={day.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                        onclick={() => handleDayClick(day)}
                        onmouseenter={() => { if (picking) hoverDate = day; }}
                        onmouseleave={() => { if (picking) hoverDate = null; }}
                      >{day.getDate()}</button>
                    </td>
                  {/each}
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      </div>
      {#if picking}
        <p class="mt-2 px-1 text-12 text-status-info" aria-live="polite">Pick the end date</p>
      {/if}
    </div>
  {/if}
</div>
