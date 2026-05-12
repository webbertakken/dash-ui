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

  let { items = [], active = $bindable(), ariaLabel = undefined,
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

<div class="tabs" role="tablist" aria-label={ariaLabel}>
  {#each items as t, i (t.id)}
    <button
      bind:this={buttons[i]}
      type="button"
      class="tab {t.id === active ? 'active' : ''}"
      role="tab"
      id="tab-{t.id}"
      aria-selected={t.id === active}
      aria-controls="tabpanel-{t.id}"
      tabindex={t.id === active ? 0 : -1}
      onclick={() => { active = t.id; onchange?.(t.id); }}
      onkeydown={(e) => onKey(e, i)}
    >
      {t.label}
      {#if t.badge !== undefined}<span class="badge">{t.badge}</span>{/if}
    </button>
  {/each}
</div>
