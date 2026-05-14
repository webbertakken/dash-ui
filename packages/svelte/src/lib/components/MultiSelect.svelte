<script module lang="ts">
  let counter = 0;
  export interface MultiSelectOption {
    value: string;
    label: string;
  }
</script>

<script lang="ts">
  import { onMount, onDestroy } from 'svelte';

  interface Props {
    options?: MultiSelectOption[];
    value?: string[];
    label?: string | undefined;
    placeholder?: string;
    id?: string | undefined;
    disabled?: boolean;
    class?: string;
    onchange?: (payload: string[]) => void;
  }

  let {
    options = [],
    value = [],
    label = undefined,
    placeholder = 'Select…',
    id = undefined,
    disabled = false,
    class: className = '',
    onchange,
  }: Props = $props();

  const uid = `dash-ui-ms-${++counter}`;
  let inputId = $derived(id ?? uid);
  let listboxId = $derived(`${inputId}-lb`);
  let open = $state(false);
  let query = $state('');
  let activeIdx = $state(-1);
  let inputEl = $state<HTMLInputElement | undefined>(undefined);
  let wrapperEl = $state<HTMLDivElement | undefined>(undefined);

  let selectedSet = $derived(new Set(value));

  let filtered = $derived(
    query.trim() === ''
      ? options
      : options.filter((o) => o.label.toLowerCase().includes(query.toLowerCase())),
  );

  let activeOptionId = $derived(
    activeIdx >= 0 && filtered[activeIdx] ? `${listboxId}-opt-${activeIdx}` : undefined,
  );

  function toggle(optValue: string) {
    const next = new Set(selectedSet);
    if (next.has(optValue)) next.delete(optValue);
    else next.add(optValue);
    onchange?.(Array.from(next));
  }

  function onKeyDown(e: KeyboardEvent) {
    if (disabled) return;
    if (e.key === 'Escape') { open = false; query = ''; return; }
    if (e.key === 'Backspace' && query === '' && value.length > 0) {
      onchange?.(value.slice(0, -1));
      return;
    }
    if (!open) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); open = true; activeIdx = 0; }
      return;
    }
    if (e.key === 'ArrowDown') { e.preventDefault(); activeIdx = Math.min(activeIdx + 1, filtered.length - 1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); activeIdx = Math.max(activeIdx - 1, 0); }
    else if (e.key === 'Home') { e.preventDefault(); activeIdx = 0; }
    else if (e.key === 'End') { e.preventDefault(); activeIdx = filtered.length - 1; }
    else if (e.key === 'Enter') { e.preventDefault(); if (activeIdx >= 0 && filtered[activeIdx]) toggle(filtered[activeIdx].value); }
    else if (e.key === 'Tab') { open = false; query = ''; }
  }

  function handleOutside(e: MouseEvent) {
    if (open && !wrapperEl?.contains(e.target as Node)) { open = false; query = ''; }
  }

  function onInput(e: Event) {
    query = (e.target as HTMLInputElement).value;
    activeIdx = -1;
    if (!open) open = true;
  }

  onMount(() => document.addEventListener('mousedown', handleOutside));
  onDestroy(() => document.removeEventListener('mousedown', handleOutside));
</script>

<div class="relative block {className}" bind:this={wrapperEl}>
  {#if label}<label for={inputId} class="sr-only">{label}</label>{/if}
  <!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
  <div
    data-open={open ? 'true' : undefined}
    class="relative flex min-h-[34px] cursor-text flex-wrap items-center gap-1 rounded-md border border-white/10 bg-[#0a0a0b] py-[3px] pl-2 pr-9 transition-colors duration-100 hover:border-white/20 data-[open=true]:border-brand-05 data-[open=true]:shadow-[0_0_0_2px_rgba(0,111,255,0.2)]"
    onclick={() => { if (!disabled) inputEl?.focus(); }}
  >
    {#each value as v (v)}
      {@const opt = options.find((o) => o.value === v)}
      {#if opt}
        <span class="inline-flex h-6 items-center gap-1 whitespace-nowrap rounded-full border border-brand-05/25 bg-brand-05/[0.14] pl-2.5 pr-1 text-12 font-medium text-[#7fb6ff]">
          <span class="leading-none">{opt.label}</span>
          <button
            type="button"
            aria-label={`Remove ${opt.label} filter`}
            class="inline-flex h-[18px] w-[18px] shrink-0 cursor-pointer items-center justify-center rounded-full border-0 bg-transparent p-0 text-[#7fb6ff] transition-colors duration-100 hover:bg-brand-05/25 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brand-05"
            onclick={(e) => { e.stopPropagation(); (() => toggle(v))(); }}
          >
            <svg viewBox="0 0 10 10" width="10" height="10" fill="none" aria-hidden="true" focusable="false">
              <path d="M2 2l6 6M8 2l-6 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </button>
        </span>
      {/if}
    {/each}
    <input
      bind:this={inputEl}
      id={inputId}
      role="combobox"
      aria-expanded={open}
      aria-controls={listboxId}
      aria-autocomplete="list"
      aria-activedescendant={activeOptionId}
      aria-label={label}
      autocomplete="off"
      spellcheck="false"
      {disabled}
      placeholder={value.length === 0 ? placeholder : ''}
      value={query}
      oninput={onInput}
      onfocus={() => { if (!disabled) open = true; }}
      onkeydown={onKeyDown}
      class="h-6 min-w-[80px] flex-1 border-0 bg-transparent px-1 text-13 leading-none text-white outline-none placeholder:text-[#6e7079]"
    />
    <button
      type="button"
      tabindex={-1}
      aria-hidden="true"
      class="absolute right-2 flex cursor-pointer items-center border-0 bg-transparent p-0.5 leading-none text-[#6e7079]"
      onclick={(e) => { e.stopPropagation(); (() => { if (open) { open = false; query = ''; } else { inputEl?.focus(); open = true; } })(); }}
    >
      <svg
        viewBox="0 0 16 16"
        aria-hidden="true"
        focusable="false"
        class="h-3.5 w-3.5 transition-transform duration-100 motion-reduce:transition-none {open ? 'rotate-180' : ''}"
      >
        <path d="M4 6l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none" />
      </svg>
    </button>
  </div>
  {#if open}
    <ul
      id={listboxId}
      role="listbox"
      aria-label={label}
      aria-multiselectable="true"
      class="absolute left-0 top-[calc(100%+4px)] z-[9000] m-0 max-h-60 min-w-full list-none overflow-y-auto rounded-lg border border-white/[0.12] bg-[#1a1a1c] p-1 shadow-[0_8px_24px_rgba(0,0,0,0.5)]"
    >
      {#if filtered.length === 0}
        <li class="list-none p-2.5 text-center text-13 text-[#6e7079]">No results</li>
      {:else}
        {#each filtered as opt, idx (opt.value)}
          {@const selected = selectedSet.has(opt.value)}
          <!-- svelte-ignore a11y_click_events_have_key_events -->
          <li
            id="{listboxId}-opt-{idx}"
            role="option"
            aria-selected={selected}
            data-active={idx === activeIdx ? 'true' : undefined}
            class="flex cursor-pointer items-center gap-2 rounded-[5px] px-2.5 py-1.5 text-13 text-[#c8c9d0] hover:bg-white/[0.06] hover:text-white data-[active=true]:bg-white/[0.06] data-[active=true]:text-white"
            onmousedown={(e) => { e.preventDefault(); (() => toggle(opt.value))(); }}
            onmouseenter={() => { activeIdx = idx; }}
          >
            <span
              aria-hidden="true"
              class="inline-flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-sm border border-white/20 {selected ? 'border-brand-05 bg-brand-05 text-white' : 'text-transparent'}"
            >
              {#if selected}
                <svg viewBox="0 0 12 12" width="12" height="12" fill="none" aria-hidden="true">
                  <path d="M2 6l3 3 5-5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              {/if}
            </span>
            {opt.label}
          </li>
        {/each}
      {/if}
    </ul>
  {/if}
</div>
