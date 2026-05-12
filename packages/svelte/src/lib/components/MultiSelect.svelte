<script module lang="ts">
  let counter = 0;
  export interface MultiSelectOption { value: string; label: string; }
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
  let inputEl: HTMLInputElement = $state();
  let wrapperEl: HTMLDivElement = $state();

  let selectedSet = $derived(new Set(value));

  let filtered =
    $derived(query.trim() === ''
      ? options
      : options.filter((o) => o.label.toLowerCase().includes(query.toLowerCase())));

  let activeOptionId =
    $derived(activeIdx >= 0 && filtered[activeIdx] ? `${listboxId}-opt-${activeIdx}` : undefined);

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

<div class="multiselect-wrapper {className}" bind:this={wrapperEl}>
  {#if label}<label for={inputId} class="sr-only">{label}</label>{/if}
  <!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
  <div
    class="multiselect-field{open ? ' multiselect-field--open' : ''}"
    onclick={() => { if (!disabled) inputEl?.focus(); }}
  >
    {#each value as v (v)}
      {@const opt = options.find((o) => o.value === v)}
      {#if opt}
        <span class="tag">
          <span class="tag__label">{opt.label}</span>
          <button
            type="button"
            class="tag__remove"
            aria-label="Remove {opt.label} filter"
            onclick={(e) => { e.stopPropagation(); (() => toggle(v))(e); }}
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
      class="multiselect-input"
    />
    <button
      type="button"
      tabindex="-1"
      aria-hidden="true"
      class="combobox-chevron-btn"
      onclick={(e) => { e.stopPropagation(); (() => { if (open) { open = false; query = ''; } else { inputEl?.focus(); open = true; } })(e); }}
    >
      <svg class="select-chevron{open ? ' combobox-chevron-open' : ''}" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
        <path d="M4 6l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none" />
      </svg>
    </button>
  </div>
  {#if open}
    <ul id={listboxId} role="listbox" aria-label={label} aria-multiselectable="true" class="select-listbox multiselect-listbox">
      {#if filtered.length === 0}
        <li class="combobox-empty">No results</li>
      {:else}
        {#each filtered as opt, idx (opt.value)}
          <!-- svelte-ignore a11y_click_events_have_key_events -->
          <li
            id="{listboxId}-opt-{idx}"
            role="option"
            aria-selected={selectedSet.has(opt.value)}
            data-active={idx === activeIdx ? 'true' : undefined}
            class="select-option multiselect-option"
            onmousedown={(e) => { e.preventDefault(); (() => toggle(opt.value))(e); }}
            onmouseenter={() => { activeIdx = idx; }}
          >
            <span class="multiselect-check" aria-hidden="true">
              {#if selectedSet.has(opt.value)}
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
