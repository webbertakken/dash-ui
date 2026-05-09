<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  export interface TabItem { id: string; label: string; badge?: string | number }
  export let items: TabItem[] = [];
  export let active: string;
  const dispatch = createEventDispatcher<{ change: string }>();
</script>

<div class="tabs">
  {#each items as t (t.id)}
    <div
      class="tab {t.id === active ? 'active' : ''}"
      on:click={() => { active = t.id; dispatch('change', t.id); }}
      on:keydown={(e) => { if (e.key === 'Enter') { active = t.id; dispatch('change', t.id); } }}
      role="tab"
      tabindex="0"
    >
      {t.label}
      {#if t.badge !== undefined}<span class="badge">{t.badge}</span>{/if}
    </div>
  {/each}
</div>
