<script module lang="ts">
  export interface TabItem { id: string; label: string; badge?: string | number }
</script>

<script lang="ts">
  interface Props {
    items?: TabItem[];
    active: string;
    ariaLabel?: string | undefined;
    onchange?: (payload: string) => void;
  }

  let {
    items = [],
    active = $bindable(),
    ariaLabel = undefined,
    onchange,
  }: Props = $props();
  let buttons: (HTMLButtonElement | null)[] = $state([]);

  function select(idx: number) {
    const next = items[(idx + items.length) % items.length];
    if (!next) return;
    active = next.id;
    onchange?.(next.id);
    buttons[(idx + items.length) % items.length]?.focus();
  }

  function onKey(e: KeyboardEvent, i: number) {
    if (e.key === 'ArrowRight') { e.preventDefault(); select(i + 1); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); select(i - 1); }
    else if (e.key === 'Home') { e.preventDefault(); select(0); }
    else if (e.key === 'End') { e.preventDefault(); select(items.length - 1); }
  }
</script>

<div
  class="flex gap-0 overflow-x-auto border-b border-border-1 px-6"
  role="tablist"
  aria-label={ariaLabel}
>
  {#each items as t, i (t.id)}
    <button
      bind:this={buttons[i]}
      type="button"
      class="-mb-px cursor-pointer select-none whitespace-nowrap border-0 border-b-2 bg-transparent px-3.5 py-[11px] text-13 leading-none focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand-05
        {t.id === active
          ? 'border-b-brand-05 text-text-1'
          : 'border-b-transparent text-text-3 hover:text-text-1'}"
      role="tab"
      id="tab-{t.id}"
      aria-selected={t.id === active}
      aria-controls="tabpanel-{t.id}"
      tabindex={t.id === active ? 0 : -1}
      onclick={() => { active = t.id; onchange?.(t.id); }}
      onkeydown={(e) => onKey(e, i)}
    >
      {t.label}
      {#if t.badge !== undefined}
        <span class="ml-1.5 tabular-nums text-text-4">{t.badge}</span>
      {/if}
    </button>
  {/each}
</div>
