<script lang="ts">
  import { onMount } from 'svelte';

  export interface ColumnDef {
    key: string;
    label: string;
    required?: boolean;
  }

  export let columns: ColumnDef[] = [];
  export let visible: Set<string> = new Set();
  export let onChange: (visible: Set<string>) => void = () => {};

  let open = false;
  let btnEl: HTMLButtonElement;
  let panelEl: HTMLDivElement;
  const panelId = `col-toggle-${Math.random().toString(36).slice(2)}`;

  function close() {
    open = false;
    btnEl?.focus();
  }

  function toggle(key: string) {
    const next = new Set(visible);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    onChange(next);
    visible = next;
  }

  function onKey(e: KeyboardEvent) {
    if (open && e.key === 'Escape') close();
  }

  function onDown(e: MouseEvent) {
    if (open && !panelEl?.contains(e.target as Node) && !btnEl?.contains(e.target as Node)) {
      close();
    }
  }

  onMount(() => {
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onDown);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onDown);
    };
  });
</script>

<div class="col-toggle">
  <button
    bind:this={btnEl}
    type="button"
    class="col-toggle__btn{open ? ' col-toggle__btn--active' : ''}"
    aria-haspopup="dialog"
    aria-expanded={open}
    aria-controls={panelId}
    on:click={() => (open = !open)}
  >
    <svg viewBox="0 0 14 14" width="14" height="14" fill="none" aria-hidden="true" focusable="false">
      <rect x="1" y="2" width="3" height="10" rx="1" stroke="currentColor" stroke-width="1.3" />
      <rect x="5.5" y="2" width="3" height="10" rx="1" stroke="currentColor" stroke-width="1.3" />
      <rect x="10" y="2" width="3" height="10" rx="1" stroke="currentColor" stroke-width="1.3" />
    </svg>
    <span>Columns</span>
  </button>
  {#if open}
    <div
      bind:this={panelEl}
      id={panelId}
      class="col-toggle__panel"
      role="dialog"
      aria-label="Toggle columns"
    >
      <div class="col-toggle__header">Columns</div>
      <ul class="col-toggle__list" role="list">
        {#each columns as col (col.key)}
          <li class="col-toggle__item">
            <label class="col-toggle__label">
              <input
                type="checkbox"
                class="col-toggle__check"
                checked={visible.has(col.key)}
                disabled={col.required}
                on:change={() => { if (!col.required) toggle(col.key); }}
              />
              <span>{col.label}</span>
            </label>
          </li>
        {/each}
      </ul>
    </div>
  {/if}
</div>
