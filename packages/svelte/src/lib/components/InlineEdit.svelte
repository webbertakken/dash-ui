<script lang="ts">
  import { tick } from 'svelte';

  interface Props {
    value: string;
    onconfirm: (v: string) => void;
    label: string;
    placeholder?: string;
  }

  let {
    value,
    onconfirm,
    label,
    placeholder = ''
  }: Props = $props();

  let editing = $state(false);
  // svelte-ignore state_referenced_locally
  let draft = $state(value);
  let inputEl: HTMLInputElement = $state();
  let editBtnEl: HTMLButtonElement = $state();

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
  <span class="ie ie--editing">
    <input
      bind:this={inputEl}
      class="ie__input"
      aria-label="Edit {label}"
      bind:value={draft}
      {placeholder}
      onkeydown={handleKeydown}
    />
    <button type="button" class="ie__btn ie__btn--save" aria-label="Save" onclick={confirm}>
      <svg viewBox="0 0 14 14" width="12" height="12" fill="none" aria-hidden="true" focusable="false">
        <path d="M2.5 7.5l3.5 3.5L12 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>
    <button type="button" class="ie__btn ie__btn--cancel" aria-label="Cancel" onclick={cancel}>
      <svg viewBox="0 0 14 14" width="12" height="12" fill="none" aria-hidden="true" focusable="false">
        <path d="M3 3l8 8M11 3l-8 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      </svg>
    </button>
  </span>
{:else}
  <span class="ie">
    <span class="ie__text">{value}</span>
    <button bind:this={editBtnEl} type="button" class="ie__edit" aria-label="Edit {label}" onclick={startEdit}>
      <svg viewBox="0 0 14 14" width="12" height="12" fill="none" aria-hidden="true" focusable="false">
        <path d="M9.5 2l2.5 2.5-8 8H1.5v-2.5l8-8z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>
  </span>
{/if}
