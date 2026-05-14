<script module lang="ts">
  export interface ColumnDef {
    key: string;
    label: string;
    required?: boolean;
  }
</script>

<script lang="ts">
  import { onMount } from 'svelte';

  interface Props {
    columns?: ColumnDef[];
    visible?: Set<string>;
    onChange?: (visible: Set<string>) => void;
  }

  let { columns = [], visible = $bindable(new Set()), onChange = () => {} }: Props = $props();

  let open = $state(false);
  let btnEl = $state<HTMLButtonElement | undefined>(undefined);
  let panelEl = $state<HTMLDivElement | undefined>(undefined);
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

<div class="relative inline-block">
  <button
    bind:this={btnEl}
    type="button"
    data-open={open ? 'true' : undefined}
    aria-haspopup="dialog"
    aria-expanded={open}
    aria-controls={panelId}
    class="inline-flex h-7 cursor-pointer items-center gap-1.5 rounded-md border border-white/10 bg-transparent px-2.5 text-12 font-medium text-text-3 transition-colors duration-100 hover:bg-white/[0.04] hover:text-white data-[open=true]:border-brand-05 data-[open=true]:bg-brand-05/[0.10] data-[open=true]:text-brand-05 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-05"
    onclick={() => (open = !open)}
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
      role="dialog"
      aria-label="Toggle columns"
      class="absolute right-0 top-[calc(100%+4px)] z-[9100] min-w-[200px] rounded-lg border border-white/[0.12] bg-[#1a1a1c] p-1 shadow-[0_8px_24px_rgba(0,0,0,0.5)]"
    >
      <div class="px-2.5 pb-1.5 pt-2 text-11 font-semibold uppercase tracking-[0.06em] text-[#6e7079]">Columns</div>
      <ul class="m-0 list-none p-0" role="list">
        {#each columns as col (col.key)}
          <li>
            <label class="flex cursor-pointer items-center gap-2 rounded-[5px] px-2.5 py-1.5 text-13 text-[#c8c9d0] hover:bg-white/[0.06] hover:text-white has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-50">
              <input
                type="checkbox"
                class="h-3.5 w-3.5 cursor-pointer appearance-none rounded-sm border-[1.5px] border-white/25 bg-[#141415] checked:border-brand-05 checked:bg-brand-05 disabled:cursor-not-allowed"
                style="background-image: var(--check-img, none);"
                checked={visible.has(col.key)}
                disabled={col.required}
                onchange={() => { if (!col.required) toggle(col.key); }}
              />
              <span>{col.label}</span>
            </label>
          </li>
        {/each}
      </ul>
    </div>
  {/if}
</div>
