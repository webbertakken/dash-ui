<script lang="ts">
  import { tick } from 'svelte';

  interface Props {
    value: string;
    onconfirm: (v: string) => void;
    label: string;
    placeholder?: string;
  }

  let { value, onconfirm, label, placeholder = '' }: Props = $props();

  let editing = $state(false);
  // svelte-ignore state_referenced_locally
  let draft = $state(value);
  let inputEl = $state<HTMLInputElement | undefined>(undefined);
  let editBtnEl = $state<HTMLButtonElement | undefined>(undefined);

  async function startEdit() {
    draft = value;
    editing = true;
    await tick();
    inputEl?.focus();
  }

  async function confirm() {
    const trimmed = draft.trim();
    if (trimmed) onconfirm(trimmed);
    editing = false;
    await tick();
    editBtnEl?.focus();
  }

  async function cancel() {
    draft = value;
    editing = false;
    await tick();
    editBtnEl?.focus();
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter') { e.preventDefault(); confirm(); }
    if (e.key === 'Escape') { e.preventDefault(); cancel(); }
  }
</script>

{#if editing}
  <span class="inline-flex items-center gap-1">
    <input
      bind:this={inputEl}
      class="min-w-[80px] max-w-[200px] rounded-[5px] border border-brand-05/50 bg-row-active px-[7px] py-0.5 text-13 leading-none text-text-1 outline-none focus:border-brand-05 focus:bg-brand-05/[0.08]"
      aria-label={`Edit ${label}`}
      bind:value={draft}
      {placeholder}
      onkeydown={handleKeydown}
    />
    <button
      type="button"
      aria-label="Save"
      class="inline-flex cursor-pointer items-center rounded border-0 bg-transparent px-1 py-0.5 text-status-success transition-[color,background-color] duration-100 hover:bg-status-success/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-05"
      onclick={confirm}
    >
      <svg viewBox="0 0 14 14" width="12" height="12" fill="none" aria-hidden="true" focusable="false">
        <path d="M2.5 7.5l3.5 3.5L12 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>
    <button
      type="button"
      aria-label="Cancel"
      class="inline-flex cursor-pointer items-center rounded border-0 bg-transparent px-1 py-0.5 text-text-4 transition-[color,background-color] duration-100 hover:bg-row-active hover:text-text-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-05"
      onclick={cancel}
    >
      <svg viewBox="0 0 14 14" width="12" height="12" fill="none" aria-hidden="true" focusable="false">
        <path d="M3 3l8 8M11 3l-8 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      </svg>
    </button>
  </span>
{:else}
  <span class="group/ie inline-flex items-center gap-1">
    <span class="text-13 text-text-1">{value}</span>
    <button
      bind:this={editBtnEl}
      type="button"
      aria-label={`Edit ${label}`}
      class="inline-flex cursor-pointer items-center rounded border-0 bg-transparent px-1 py-0.5 text-text-4 opacity-0 transition-[opacity,color] duration-100 hover:text-text-2 focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-05 group-hover/ie:opacity-100"
      onclick={startEdit}
    >
      <svg viewBox="0 0 14 14" width="12" height="12" fill="none" aria-hidden="true" focusable="false">
        <path d="M9.5 2l2.5 2.5-8 8H1.5v-2.5l8-8z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>
  </span>
{/if}
