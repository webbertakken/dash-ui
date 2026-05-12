<script context="module" lang="ts">
  export interface TabItem { id: string; label: string; badge?: string | number }
</script>

<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  export let items: TabItem[] = [];
  export let active: string;
  export let ariaLabel: string | undefined = undefined;
  const dispatch = createEventDispatcher<{ change: string }>();

  let buttons: (HTMLButtonElement | null)[] = [];

  function select(idx: number) {
    const next = items[(idx + items.length) % items.length];
    if (!next) return;
    active = next.id;
    dispatch('change', next.id);
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
      on:click={() => { active = t.id; dispatch('change', t.id); }}
      on:keydown={(e) => onKey(e, i)}
    >
      {t.label}
      {#if t.badge !== undefined}<span class="badge">{t.badge}</span>{/if}
    </button>
  {/each}
</div>
