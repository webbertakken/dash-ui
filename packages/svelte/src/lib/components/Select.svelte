<script module lang="ts">
  let counter = 0;
  export interface SelectOption {
    value: string;
    label: string;
  }
</script>

<script lang="ts">
  import { onMount, onDestroy } from 'svelte';

  interface Props {
    options?: SelectOption[];
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
    placeholder = 'Select…',
    id = undefined,
    disabled = false,
    class: className = '',
    onchange,
  }: Props = $props();

  const uid = `dash-ui-sel-${++counter}`;
  let triggerId = $derived(id ?? uid);
  let listboxId = $derived(`${triggerId}-lb`);
  let open = $state(false);
  let activeIdx = $state(-1);
  let triggerEl = $state<HTMLButtonElement | undefined>(undefined);
  let wrapperEl = $state<HTMLDivElement | undefined>(undefined);

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
    onchange?.(val);
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

<div class="relative inline-block {className}" bind:this={wrapperEl}>
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
    type="button"
    class="inline-flex h-[34px] cursor-pointer select-none items-center gap-1.5 whitespace-nowrap rounded-md border border-white/10 bg-[#0a0a0b] pl-3 pr-2.5 text-13 leading-none text-white transition-colors duration-100 hover:border-white/20 aria-expanded:border-brand-05 aria-expanded:shadow-[0_0_0_2px_rgba(0,111,255,0.2)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-05 disabled:cursor-not-allowed disabled:opacity-40"
    onclick={toggle}
    onkeydown={onKeyDown}
  >
    <span>{displayLabel}</span>
    <svg
      viewBox="0 0 16 16"
      aria-hidden="true"
      focusable="false"
      class="h-3.5 w-3.5 shrink-0 text-[#6e7079] transition-transform duration-100 motion-reduce:transition-none {open ? 'rotate-180' : ''}"
    >
      <path d="M4 6l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none" />
    </svg>
  </button>
  {#if open}
    <ul
      id={listboxId}
      role="listbox"
      aria-label={label}
      class="absolute left-0 top-[calc(100%+4px)] z-[9000] m-0 min-w-full list-none rounded-lg border border-white/[0.12] bg-[#1a1a1c] p-1 shadow-[0_8px_24px_rgba(0,0,0,0.5)]"
    >
      {#each options as opt, idx (opt.value)}
        <li
          role="option"
          aria-selected={opt.value === value}
          data-active={idx === activeIdx ? 'true' : undefined}
          class="flex cursor-pointer items-center rounded-[5px] px-2.5 py-1.5 text-13 text-[#c8c9d0] hover:bg-white/[0.06] hover:text-white data-[active=true]:bg-white/[0.06] data-[active=true]:text-white aria-selected:font-medium aria-selected:text-brand-05"
          onmousedown={(e) => { e.preventDefault(); (() => pick(opt.value))(); }}
          onmouseenter={() => { activeIdx = idx; }}
        >{opt.label}</li>
      {/each}
    </ul>
  {/if}
</div>
