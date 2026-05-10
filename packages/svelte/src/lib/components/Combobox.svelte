<script context="module" lang="ts">
  let counter = 0;
  export interface ComboboxOption { value: string; label: string; }
</script>

<script lang="ts">
  import { createEventDispatcher, onMount, onDestroy } from 'svelte';

  export let options: ComboboxOption[] = [];
  export let value: string | undefined = undefined;
  export let label: string | undefined = undefined;
  export let placeholder: string = 'Search…';
  export let id: string | undefined = undefined;
  export let disabled: boolean = false;
  let className = '';
  export { className as class };

  const uid = `dash-ui-cb-${++counter}`;
  $: inputId = id ?? uid;
  $: listboxId = `${inputId}-lb`;

  const dispatch = createEventDispatcher<{ change: string }>();

  let open = false;
  let query = '';
  let activeIdx = -1;
  let inputEl: HTMLInputElement;
  let wrapperEl: HTMLDivElement;

  $: selectedOption = options.find((o) => o.value === value);

  $: filtered = query.trim() === ''
    ? options
    : options.filter((o) => o.label.toLowerCase().includes(query.toLowerCase()));

  $: activeOptionId = activeIdx >= 0 && filtered[activeIdx]
    ? `${listboxId}-opt-${activeIdx}`
    : undefined;

  $: displayValue = open ? query : (selectedOption?.label ?? '');

  function openList() {
    if (disabled) return;
    query = selectedOption?.label ?? '';
    activeIdx = options.findIndex((o) => o.value === value);
    open = true;
  }

  function pick(opt: ComboboxOption) {
    dispatch('change', opt.value);
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

<div class="combobox-wrapper {className}" bind:this={wrapperEl}>
  {#if label}<label for={inputId} class="sr-only">{label}</label>{/if}
  <div class="combobox-field">
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
      on:input={onInputChange}
      on:focus={openList}
      on:keydown={onKeyDown}
      class="combobox-input"
    />
    <button
      type="button"
      tabindex="-1"
      aria-hidden="true"
      class="combobox-chevron-btn"
      on:click={() => { if (open) { open = false; query = ''; } else { inputEl?.focus(); openList(); } }}
    >
      <svg class="select-chevron{open ? ' combobox-chevron-open' : ''}" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
        <path d="M4 6l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none" />
      </svg>
    </button>
  </div>
  {#if open}
    <ul id={listboxId} role="listbox" aria-label={label} class="select-listbox combobox-listbox">
      {#if filtered.length === 0}
        <li class="combobox-empty">No results</li>
      {:else}
        {#each filtered as opt, idx (opt.value)}
          <li
            id="{listboxId}-opt-{idx}"
            role="option"
            aria-selected={opt.value === value}
            data-active={idx === activeIdx ? 'true' : undefined}
            class="select-option"
            on:mousedown|preventDefault={() => pick(opt)}
            on:mouseenter={() => { activeIdx = idx; }}
          >{opt.label}</li>
        {/each}
      {/if}
    </ul>
  {/if}
</div>
