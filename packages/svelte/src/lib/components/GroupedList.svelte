<script module lang="ts">
  export type GroupedListItemStatus = 'danger' | 'warn' | 'success' | 'info' | 'neutral';

  export interface GroupedListItem {
    label: string;
    sublabel?: string;
    meta?: string;
    status?: GroupedListItemStatus;
  }

  export interface GroupedListGroup {
    label: string;
    items: GroupedListItem[];
    defaultOpen?: boolean;
    color?: string;
  }
</script>

<script lang="ts">
  interface Props {
    groups: GroupedListGroup[];
    collapsible?: boolean;
    ariaLabel?: string;
  }

  let { groups, collapsible = true, ariaLabel = 'Grouped list' }: Props = $props();

  const STATUS_COLORS: Record<GroupedListItemStatus, string> = {
    danger: '#F03A3A',
    warn: '#F5A623',
    success: '#00B070',
    info: '#006FFF',
    neutral: '#6E7079',
  };

  const uid = Math.random().toString(36).slice(2, 9);
  // svelte-ignore state_referenced_locally
  let open: boolean[] = $state(groups.map((g) => g.defaultOpen !== false));

  function toggle(i: number) {
    open[i] = !open[i];
    open = [...open];
  }

  const HEADER_CLS =
    'flex w-full items-center gap-2 rounded-md border border-border-1 bg-divider px-3 py-2 text-13 text-text-1';
  const HEADER_BTN =
    HEADER_CLS + ' cursor-pointer hover:bg-row-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-05';
</script>

<div class="flex flex-col gap-1.5" aria-label={ariaLabel}>
  {#each groups as group, gi}
    {@const isOpen = open[gi]}
    {@const panelId = `${uid}-gl-${gi}`}
    <div class="flex flex-col gap-0.5">
      {#if collapsible}
        <button
          type="button"
          aria-expanded={isOpen}
          aria-controls={panelId}
          class={HEADER_BTN}
          onclick={() => toggle(gi)}
        >
          {#if group.color}
            <span class="inline-block h-2 w-2 shrink-0 rounded-full" style="background:{group.color}" aria-hidden="true"></span>
          {/if}
          <span class="flex-1 text-left font-medium">{group.label}</span>
          <span class="rounded bg-row-active px-1.5 py-0.5 text-11 text-text-3 tabular-nums">{group.items.length}</span>
          <svg
            width="12" height="12" viewBox="0 0 12 12"
            aria-hidden="true" focusable="false"
            class="text-text-4 transition-transform duration-100 motion-reduce:transition-none {isOpen ? 'rotate-180' : ''}"
          >
            <path d="M2 4l4 4 4-4" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      {:else}
        <div class={HEADER_CLS}>
          {#if group.color}
            <span class="inline-block h-2 w-2 shrink-0 rounded-full" style="background:{group.color}" aria-hidden="true"></span>
          {/if}
          <span class="flex-1 text-left font-medium">{group.label}</span>
          <span class="rounded bg-row-active px-1.5 py-0.5 text-11 text-text-3 tabular-nums">{group.items.length}</span>
        </div>
      {/if}
      {#if !collapsible || isOpen}
        <ul id={panelId} class="m-0 flex list-none flex-col gap-0.5 p-0 pl-4" role="list">
          {#each group.items as item}
            <li class="flex items-center gap-2 rounded px-2 py-1.5 text-13 hover:bg-divider">
              {#if item.status}
                <span
                  class="inline-block h-2 w-2 shrink-0 rounded-full"
                  style="background:{STATUS_COLORS[item.status]}"
                  aria-label={item.status}
                ></span>
              {/if}
              <div class="min-w-0 flex-1">
                <div class="truncate text-text-2">{item.label}</div>
                {#if item.sublabel}<div class="truncate text-11 text-text-4">{item.sublabel}</div>{/if}
              </div>
              {#if item.meta}<span class="shrink-0 text-11 text-text-4 tabular-nums">{item.meta}</span>{/if}
            </li>
          {/each}
        </ul>
      {/if}
    </div>
  {/each}
</div>
