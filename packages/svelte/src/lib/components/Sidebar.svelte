<script lang="ts" context="module">
  import type { ComponentType } from 'svelte';
  export interface SidebarItemDef {
    id: string;
    label: string;
    icon: ComponentType;
    count?: number;
    pill?: number;
  }
  export interface SidebarSectionDef {
    title: string;
    items: SidebarItemDef[];
  }
</script>

<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  export let sections: SidebarSectionDef[] = [];
  export let activeId: string;
  const dispatch = createEventDispatcher<{ change: string }>();
</script>

<aside class="sidebar">
  {#each sections as sec (sec.title)}
    <div class="sb-section">{sec.title}</div>
    <div class="sb-list">
      {#each sec.items as it (it.id)}
        <a
          class="sb-item {it.id === activeId ? 'active' : ''}"
          on:click={() => { activeId = it.id; dispatch('change', it.id); }}
        >
          <span class="sb-ico"><svelte:component this={it.icon} /></span>
          {it.label}
          {#if it.count !== undefined}<span class="sb-count">{it.count}</span>{/if}
          {#if it.pill !== undefined}<span class="sb-pill">{it.pill}</span>{/if}
        </a>
      {/each}
    </div>
  {/each}
</aside>
