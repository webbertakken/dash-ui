<script module lang="ts">
  let counter = 0;
  export interface SplitButtonItem {
    id: string;
    label: string;
    disabled?: boolean;
  }
</script>

<script lang="ts">
  import { onMount, onDestroy } from 'svelte';

  interface Props {
    label: string;
    variant?: 'primary' | 'ghost' | 'danger';
    disabled?: boolean;
    items?: SplitButtonItem[];
    onprimary?: () => void;
    onaction?: (payload: string) => void;
  }

  let {
    label,
    variant = 'ghost',
    disabled = false,
    items = [],
    onprimary,
    onaction,
  }: Props = $props();
  const uid = `dash-ui-spbtn-${++counter}`;
  const menuId = `${uid}-menu`;

  let open = $state(false);
  let activeIdx = $state(0);
  let caretEl = $state<HTMLButtonElement | undefined>(undefined);
  let wrapperEl = $state<HTMLDivElement | undefined>(undefined);

  function toggleMenu() {
    if (!open) activeIdx = 0;
    open = !open;
  }

  function activate(id: string) {
    onaction?.(id);
    open = false;
    caretEl?.focus();
  }

  function onKeyDown(e: KeyboardEvent) {
    if (!open) {
      if (['ArrowDown', 'Enter', ' '].includes(e.key)) {
        e.preventDefault();
        activeIdx = 0;
        open = true;
      }
      return;
    }
    if (e.key === 'Escape') { e.preventDefault(); open = false; caretEl?.focus(); }
    else if (e.key === 'ArrowDown') { e.preventDefault(); activeIdx = Math.min(activeIdx + 1, items.length - 1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); activeIdx = Math.max(activeIdx - 1, 0); }
    else if (e.key === 'Home') { e.preventDefault(); activeIdx = 0; }
    else if (e.key === 'End') { e.preventDefault(); activeIdx = items.length - 1; }
    else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const item = items[activeIdx];
      if (item && !item.disabled) activate(item.id);
    }
    else if (e.key === 'Tab') { open = false; }
  }

  function handleOutside(e: MouseEvent) {
    if (open && !wrapperEl?.contains(e.target as Node)) open = false;
  }

  onMount(() => document.addEventListener('mousedown', handleOutside));
  onDestroy(() => document.removeEventListener('mousedown', handleOutside));

  // Pre-composed variant chrome so Tailwind's static scanner sees the literals.
  const VARIANT: Record<NonNullable<Props['variant']>, string> = {
    primary: 'bg-brand-05 text-white hover:bg-brand-06 border-brand-05',
    ghost: 'bg-transparent text-[#c8c9d0] border-white/10 hover:bg-white/[0.04] hover:text-white',
    danger: 'bg-transparent text-[#ff7b7b] border-status-danger/30',
  };
  // Shared button base — same metrics as the migrated Button.
  const BTN_BASE =
    'inline-flex h-[30px] cursor-pointer items-center gap-1.5 whitespace-nowrap border px-3 text-13 font-medium transition-all duration-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-05 disabled:cursor-not-allowed disabled:opacity-55';
</script>

<div class="relative inline-flex items-stretch" bind:this={wrapperEl}>
  <button
    type="button"
    {disabled}
    class="{BTN_BASE} {VARIANT[variant]} rounded-l-md border-r-0 rounded-r-none"
    onclick={() => onprimary?.()}
  >{label}</button>
  <button
    bind:this={caretEl}
    type="button"
    {disabled}
    aria-label={`${label} options`}
    aria-haspopup="menu"
    aria-expanded={open}
    aria-controls={open ? menuId : undefined}
    class="{BTN_BASE} {VARIANT[variant]} w-[26px] shrink-0 justify-center rounded-r-md rounded-l-none px-0 border-l border-l-white/15"
    onclick={toggleMenu}
    onkeydown={onKeyDown}
  >
    <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M1 3 L5 7 L9 3" />
    </svg>
  </button>
  {#if open}
    <ul
      id={menuId}
      role="menu"
      aria-label={`${label} options`}
      class="absolute right-0 top-[calc(100%+4px)] z-[9100] m-0 min-w-[148px] list-none rounded-lg border border-white/[0.12] bg-[#1a1a1c] p-1 shadow-[0_8px_24px_rgba(0,0,0,0.5)]"
    >
      {#each items as item, idx (item.id)}
        <li
          role="menuitem"
          tabindex={-1}
          aria-disabled={item.disabled}
          data-active={idx === activeIdx ? 'true' : undefined}
          class="flex cursor-pointer items-center whitespace-nowrap rounded-[5px] px-2.5 py-1.5 text-13 text-[#c8c9d0] outline-none hover:bg-white/[0.06] hover:text-white data-[active=true]:bg-white/[0.06] data-[active=true]:text-white aria-disabled:cursor-not-allowed aria-disabled:opacity-40"
          onmouseenter={() => { activeIdx = idx; }}
          onmousedown={(e) => { e.preventDefault(); (() => { if (!item.disabled) activate(item.id); })(); }}
        >{item.label}</li>
      {/each}
    </ul>
  {/if}
</div>
