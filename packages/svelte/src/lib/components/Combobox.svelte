<script module lang="ts">
  let counter = 0;
  export interface ComboboxOption {
    value: string;
    label: string;
  }
</script>

<script lang="ts">
  import { onMount, onDestroy } from 'svelte';

  interface Props {
    options?: ComboboxOption[];
    value?: string | undefined;
    label?: string | undefined;
    placeholder?: string;
    id?: string | undefined;
    disabled?: boolean;
    class?: string;
    onchange?: (payload: string) => void;
  }

  let {
    options = [],
    value = undefined,
    label = undefined,
    placeholder = 'Search…',
    id = undefined,
    disabled = false,
    class: className = '',
    onchange,
  }: Props = $props();

  const uid = `dash-ui-cb-${++counter}`;
  let inputId = $derived(id ?? uid);
  let listboxId = $derived(`${inputId}-lb`);
  let open = $state(false);
  let query = $state('');
  let activeIdx = $state(-1);
  let inputEl = $state<HTMLInputElement | undefined>(undefined);
  let wrapperEl = $state<HTMLDivElement | undefined>(undefined);

  let selectedOption = $derived(options.find((o) => o.value === value));

  let filtered = $derived(
    query.trim() === ''
      ? options
      : options.filter((o) => o.label.toLowerCase().includes(query.toLowerCase())),
  );

  let activeOptionId = $derived(
    activeIdx >= 0 && filtered[activeIdx] ? `${listboxId}-opt-${activeIdx}` : undefined,
  );

  let displayValue = $derived(open ? query : (selectedOption?.label ?? ''));

  function openList() {
    if (disabled) return;
    query = selectedOption?.label ?? '';
    activeIdx = options.findIndex((o) => o.value === value);
    open = true;
  }

  function pick(opt: ComboboxOption) {
    onchange?.(opt.value);
    open = false;
    query = '';
    inputEl?.focus();
  }

  function onInputChange(e: Event) {
    query = (e.target as HTMLInputElement).value;
    activeIdx = -1;
    if (!open) open = true;
  }

  function onKeyDown(e: KeyboardEvent) {
    if (disabled) return;
    if (e.key === 'Escape') { open = false; query = ''; return; }
    if (!open) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); openList(); }
      return;
    }
    if (e.key === 'ArrowDown') { e.preventDefault(); activeIdx = Math.min(activeIdx + 1, filtered.length - 1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); activeIdx = Math.max(activeIdx - 1, 0); }
    else if (e.key === 'Home') { e.preventDefault(); activeIdx = 0; }
    else if (e.key === 'End') { e.preventDefault(); activeIdx = filtered.length - 1; }
    else if (e.key === 'Enter') { e.preventDefault(); if (activeIdx >= 0 && filtered[activeIdx]) pick(filtered[activeIdx]); }
    else if (e.key === 'Tab') { open = false; query = ''; }
  }

  function handleOutside(e: MouseEvent) {
    if (open && !wrapperEl?.contains(e.target as Node)) { open = false; query = ''; }
  }

  onMount(() => document.addEventListener('mousedown', handleOutside));
  onDestroy(() => document.removeEventListener('mousedown', handleOutside));
</script>

<div class="relative block {className}" bind:this={wrapperEl}>
  {#if label}<label for={inputId} class="sr-only">{label}</label>{/if}
  <div class="relative flex items-center">
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
      {placeholder}
      value={displayValue}
      oninput={onInputChange}
      onfocus={openList}
      onkeydown={onKeyDown}
      class="box-border h-[34px] w-full rounded-md border border-white/10 bg-[#0a0a0b] py-0 pl-3 pr-9 text-13 leading-none text-white transition-colors duration-100 hover:border-white/20 focus:border-brand-05 focus:outline-none focus:shadow-[0_0_0_2px_rgba(0,111,255,0.2)] disabled:cursor-not-allowed disabled:opacity-40"
    />
    <button
      type="button"
      tabindex={-1}
      aria-hidden="true"
      class="absolute right-2 flex cursor-pointer items-center border-0 bg-transparent p-0.5 leading-none text-[#6e7079]"
      onclick={() => { if (open) { open = false; query = ''; } else { inputEl?.focus(); openList(); } }}
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
      class="absolute left-0 top-[calc(100%+4px)] z-[9000] m-0 max-h-60 min-w-full list-none overflow-y-auto rounded-lg border border-white/[0.12] bg-[#1a1a1c] p-1 shadow-[0_8px_24px_rgba(0,0,0,0.5)]"
    >
      {#if filtered.length === 0}
        <li class="list-none p-2.5 text-center text-13 text-[#6e7079]">No results</li>
      {:else}
        {#each filtered as opt, idx (opt.value)}
          <li
            id="{listboxId}-opt-{idx}"
            role="option"
            aria-selected={opt.value === value}
            data-active={idx === activeIdx ? 'true' : undefined}
            class="flex cursor-pointer items-center rounded-[5px] px-2.5 py-1.5 text-13 text-[#c8c9d0] hover:bg-white/[0.06] hover:text-white data-[active=true]:bg-white/[0.06] data-[active=true]:text-white aria-selected:font-medium aria-selected:text-brand-05"
            onmousedown={(e) => { e.preventDefault(); (() => pick(opt))(); }}
            onmouseenter={() => { activeIdx = idx; }}
          >{opt.label}</li>
        {/each}
      {/if}
    </ul>
  {/if}
</div>
