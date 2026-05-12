<script lang="ts" module>
  import type { Component } from 'svelte';
  export interface SidebarItemDef {
    id: string;
    label: string;
    icon: Component<Record<string, unknown>>;
    count?: number;
    pill?: number;
  }
  export interface SidebarSectionDef {
    title: string;
    items: SidebarItemDef[];
  }
</script>

<script lang="ts">
  
  interface Props {
    sections?: SidebarSectionDef[];
    activeId: string;
    onchange?: (payload: string) => void;
  }

  let { sections = [], activeId = $bindable(),
    onchange,
  }: Props = $props();
</script>

<nav class="sidebar" aria-label="Primary">
  {#each sections as sec (sec.title)}
    <h2 class="sb-section">{sec.title}</h2>
    <ul class="sb-list">
      {#each sec.items as it (it.id)}
        <li>
          <button
            type="button"
            class="sb-item {it.id === activeId ? 'active' : ''}"
            aria-current={it.id === activeId ? 'page' : undefined}
            onclick={() => { activeId = it.id; onchange?.(it.id); }}
          >
            <span class="sb-ico"><it.icon /></span>
            {it.label}
            {#if it.count !== undefined}<span class="sb-count">{it.count}</span>{/if}
            {#if it.pill !== undefined}<span class="sb-pill">{it.pill}<span class="sr-only"> alert{it.pill !== 1 ? 's' : ''}</span></span>{/if}
          </button>
        </li>
      {/each}
    </ul>
  {/each}
</nav>
