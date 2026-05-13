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

  let { sections = [], activeId = $bindable(), onchange }: Props = $props();
</script>

<!--
  Same chrome-stays-dark rule as Topbar: bg #0a0a0b, border
  rgba(255,255,255,0.06), text colours hardcoded to dashboard.css's literal
  values regardless of `data-motif`.
-->
<nav
  class="overflow-auto border-r border-white/[0.06] bg-neutral-10 py-2"
  aria-label="Primary"
>
  {#each sections as sec (sec.title)}
    <h2
      class="m-0 px-4 pb-1.5 pt-3.5 text-[10px] font-semibold uppercase leading-[1.4] tracking-[0.06em] text-neutral-05"
    >{sec.title}</h2>
    <ul class="m-0 flex list-none flex-col gap-px px-2">
      {#each sec.items as it (it.id)}
        <li>
          <button
            type="button"
            class="flex w-full cursor-pointer select-none items-center gap-2.5 rounded-md bg-transparent px-2.5 py-1.5 text-left font-[inherit] text-13 leading-[18px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-05
              {it.id === activeId
                ? '[&_.sb-ico]:text-brand-05 bg-white/[0.06] text-white'
                : 'text-[#c8c9d0] hover:bg-white/[0.04] hover:text-white'}"
            aria-current={it.id === activeId ? 'page' : undefined}
            onclick={() => { activeId = it.id; onchange?.(it.id); }}
          >
            <span class="sb-ico shrink-0 text-neutral-04 [&_svg]:h-4 [&_svg]:w-4"
              ><it.icon /></span>
            {it.label}
            {#if it.count !== undefined}
              <span
                class="ml-auto text-[11px] tabular-nums {it.id === activeId
                  ? 'text-neutral-04'
                  : 'text-neutral-05'}"
              >{it.count}</span>
            {/if}
            {#if it.pill !== undefined}
              <span
                class="ml-auto rounded-full bg-brand-05 px-1.5 py-px text-[10px] font-semibold text-white"
              >{it.pill}<span class="sr-only"> alert{it.pill !== 1 ? 's' : ''}</span></span>
            {/if}
          </button>
        </li>
      {/each}
    </ul>
  {/each}
</nav>
