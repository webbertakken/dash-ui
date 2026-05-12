<script module lang="ts">
  let counter = 0;
  export interface SelectOption { value: string; label: string; }
</script>

<script lang="ts">
  import { preventDefault } from 'svelte/legacy';

  import { createEventDispatcher, onMount, onDestroy } from 'svelte';

  interface Props {
    options?: SelectOption[];
    value?: string | undefined;
    label?: string | undefined;
    placeholder?: string;
    id?: string | undefined;
    disabled?: boolean;
    class?: string;
  }

  let {
    options = [],
    value = undefined,
    label = undefined,
    placeholder = 'Select…',
    id = undefined,
    disabled = false,
    class: className = ''
  }: Props = $props();
  

  const uid = `dash-ui-sel-${++counter}`;
  let triggerId = $derived(id ?? uid);
  let listboxId = $derived(`${triggerId}-lb`);

  const dispatch = createEventDispatcher<{ change: string }>();

  let open = $state(false);
  let activeIdx = $state(-1);
  let triggerEl: HTMLButtonElement = $state();
  let wrapperEl: HTMLDivElement = $state();

  let selected = $derived(options.find((o) => o.value === value));
  let displayLabel = $derived(selected?.label ?? placeholder);

  function toggle() {
    if (disabled) return;
    if (!open) {
      const idx = options.findIndex((o) => o.value === value);
      activeIdx = idx >= 0 ? idx : 0;
    }
    open = !open;
  }

  function pick(val: string) {
    dispatch('change', val);
    open = false;
    triggerEl?.focus();
  }

  function onKeyDown(e: KeyboardEvent) {
    if (disabled) return;
    if (e.key === 'Escape') { open = false; triggerEl?.focus(); return; }
    if (!open) {
      if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) {
        e.preventDefault();
        const idx = options.findIndex((o) => o.value === value);
        activeIdx = idx >= 0 ? idx : 0;
        open = true;
      }
      return;
    }
    if (e.key === 'ArrowDown') { e.preventDefault(); activeIdx = Math.min(activeIdx + 1, options.length - 1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); activeIdx = Math.max(activeIdx - 1, 0); }
    else if (e.key === 'Home') { e.preventDefault(); activeIdx = 0; }
    else if (e.key === 'End') { e.preventDefault(); activeIdx = options.length - 1; }
    else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); if (activeIdx >= 0) pick(options[activeIdx].value); }
    else if (e.key === 'Tab') { open = false; }
  }

  function handleOutside(e: MouseEvent) {
    if (open && !wrapperEl?.contains(e.target as Node)) open = false;
  }

  onMount(() => document.addEventListener('mousedown', handleOutside));
  onDestroy(() => document.removeEventListener('mousedown', handleOutside));
</script>

<div class="select-wrapper {className}" bind:this={wrapperEl}>
  {#if label}<label for={triggerId} class="sr-only">{label}</label>{/if}
  <button
    bind:this={triggerEl}
    id={triggerId}
    role="combobox"
    aria-haspopup="listbox"
    aria-expanded={open}
    aria-controls={listboxId}
    aria-label={label}
    {disabled}
    class="select-trigger"
    onclick={toggle}
    onkeydown={onKeyDown}
    type="button"
  >
    <span>{displayLabel}</span>
    <svg class="select-chevron" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
      <path d="M4 6l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none" />
    </svg>
  </button>
  {#if open}
    <ul id={listboxId} role="listbox" aria-label={label} class="select-listbox">
      {#each options as opt, idx (opt.value)}
        <li
          role="option"
          aria-selected={opt.value === value}
          data-active={idx === activeIdx ? 'true' : undefined}
          class="select-option"
          onmousedown={preventDefault(() => pick(opt.value))}
          onmouseenter={() => { activeIdx = idx; }}
        >{opt.label}</li>
      {/each}
    </ul>
  {/if}
</div>
