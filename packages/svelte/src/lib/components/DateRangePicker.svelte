<script context="module" lang="ts">
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
  import { createEventDispatcher, onMount, onDestroy } from 'svelte';

  export let value: DateRange = { start: null, end: null };
  export let placeholder: string = 'Select date range';
  export let disabled: boolean = false;

  const dispatch = createEventDispatcher<{ change: DateRange }>();
  const uid = `dash-ui-drp-${++counter}`;
  const dlgId = `${uid}-dlg`;
  const today = new Date();

  let open = false;
  let picking: Date | null = null;
  let hoverDate: Date | null = null;
  let viewYear = today.getFullYear();
  let viewMonth = today.getMonth();
  let triggerEl: HTMLButtonElement;
  let dlgEl: HTMLDivElement;

  $: rightMonth = viewMonth === 11 ? 0 : viewMonth + 1;
  $: rightYear = viewMonth === 11 ? viewYear + 1 : viewYear;
  $: leftGrid = buildGrid(viewYear, viewMonth);
  $: rightGrid = buildGrid(rightYear, rightMonth);

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
      dispatch('change', { start: day, end: null });
    } else {
      const [s, e] = day < picking ? [day, picking] : [picking, day];
      picking = null;
      hoverDate = null;
      dispatch('change', { start: s, end: e });
      open = false;
      triggerEl?.focus();
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
</script>

<div class="drp-root">
  <button
    bind:this={triggerEl}
    type="button"
    class="btn dp-trigger"
    aria-haspopup="dialog"
    aria-expanded={open}
    aria-controls={open ? dlgId : undefined}
    {disabled}
    on:click={() => { if (open) { open = false; picking = null; } else open = true; }}
  >
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
      <rect x="1" y="2" width="12" height="11" rx="1.5" />
      <path d="M1 6h12M4 1v2M10 1v2" />
    </svg>
    {formatRange() ?? placeholder}
  </button>

  {#if open}
    <!-- svelte-ignore a11y-no-noninteractive-element-interactions - dialog uses keyboard listener for Escape -->
    <div
      id={dlgId}
      bind:this={dlgEl}
      role="dialog"
      aria-modal="true"
      aria-label="Select date range"
      class="drp-cal"
      on:keydown={(e) => {
        if (e.key === 'Escape') { e.preventDefault(); open = false; picking = null; triggerEl?.focus(); }
      }}
    >
      <div class="drp-months">
        <!-- Left calendar -->
        <div class="drp-month">
          <div class="dp-header">
            <button type="button" class="dp-nav" on:click={prevMonth} aria-label="Previous month">
              <svg width="8" height="12" viewBox="0 0 8 12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
                <path d="M7 1L2 6l5 5" />
              </svg>
            </button>
            <span class="dp-month-label" aria-live="polite">{MONTHS[viewMonth]} {viewYear}</span>
            <span style="width:28px;display:inline-block;" aria-hidden="true"></span>
          </div>
          <table role="grid" class="dp-grid" aria-label="{MONTHS[viewMonth]} {viewYear}">
            <thead>
              <tr>{#each DAYS as d}<th scope="col" abbr={d}>{d}</th>{/each}</tr>
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
                    <td role="gridcell" aria-selected={start || end}>
                      <button
                        type="button"
                        class="dp-day{outside ? ' dp-day--outside' : ''}{isTodayDay && !start && !end ? ' dp-day--today' : ''}{start ? ' dp-day--start' : ''}{end ? ' dp-day--end' : ''}{inRange ? ' dp-day--in-range' : ''}"
                        aria-label={day.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                        on:click={() => handleDayClick(day)}
                        on:mouseenter={() => { if (picking) hoverDate = day; }}
                        on:mouseleave={() => { if (picking) hoverDate = null; }}
                      >{day.getDate()}</button>
                    </td>
                  {/each}
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
        <!-- Right calendar -->
        <div class="drp-month">
          <div class="dp-header">
            <span style="width:28px;display:inline-block;" aria-hidden="true"></span>
            <span class="dp-month-label" aria-live="polite">{MONTHS[rightMonth]} {rightYear}</span>
            <button type="button" class="dp-nav" on:click={nextMonth} aria-label="Next month">
              <svg width="8" height="12" viewBox="0 0 8 12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
                <path d="M1 1l5 5-5 5" />
              </svg>
            </button>
          </div>
          <table role="grid" class="dp-grid" aria-label="{MONTHS[rightMonth]} {rightYear}">
            <thead>
              <tr>{#each DAYS as d}<th scope="col" abbr={d}>{d}</th>{/each}</tr>
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
                    <td role="gridcell" aria-selected={start || end}>
                      <button
                        type="button"
                        class="dp-day{outside ? ' dp-day--outside' : ''}{isTodayDay && !start && !end ? ' dp-day--today' : ''}{start ? ' dp-day--start' : ''}{end ? ' dp-day--end' : ''}{inRange ? ' dp-day--in-range' : ''}"
                        aria-label={day.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                        on:click={() => handleDayClick(day)}
                        on:mouseenter={() => { if (picking) hoverDate = day; }}
                        on:mouseleave={() => { if (picking) hoverDate = null; }}
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
        <p class="drp-hint" aria-live="polite">Pick the end date</p>
      {/if}
    </div>
  {/if}
</div>
