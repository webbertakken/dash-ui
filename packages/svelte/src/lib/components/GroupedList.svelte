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
  let open: boolean[] = $state(groups.map(g => g.defaultOpen !== false));

  function toggle(i: number) { open[i] = !open[i]; open = [...open]; }
</script>

<div class="gl" aria-label={ariaLabel}>
  {#each groups as group, gi}
    {@const isOpen = open[gi]}
    {@const panelId = `${uid}-gl-${gi}`}
    <div class="gl-group">
      {#if collapsible}
        <button
          type="button"
          class="gl-header"
          aria-expanded={isOpen}
          aria-controls={panelId}
          onclick={() => toggle(gi)}
        >
          {#if group.color}<span class="gl-color-dot" style="background:{group.color}" aria-hidden="true"></span>{/if}
          <span class="gl-title">{group.label}</span>
          <span class="gl-count">{group.items.length}</span>
          <svg
            class="gl-chevron{isOpen ? ' gl-chevron--open' : ''}"
            width="12" height="12" viewBox="0 0 12 12"
            aria-hidden="true" focusable="false"
          >
            <path d="M2 4l4 4 4-4" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      {:else}
        <div class="gl-header gl-header--static">
          {#if group.color}<span class="gl-color-dot" style="background:{group.color}" aria-hidden="true"></span>{/if}
          <span class="gl-title">{group.label}</span>
          <span class="gl-count">{group.items.length}</span>
        </div>
      {/if}
      {#if !collapsible || isOpen}
        <ul id={panelId} class="gl-items" role="list">
          {#each group.items as item}
            <li class="gl-item">
              {#if item.status}
                <span class="gl-item-dot" style="background:{STATUS_COLORS[item.status]}" aria-label={item.status}></span>
              {/if}
              <div class="gl-item-body">
                <div class="gl-item-label">{item.label}</div>
                {#if item.sublabel}<div class="gl-item-sublabel">{item.sublabel}</div>{/if}
              </div>
              {#if item.meta}<span class="gl-item-meta">{item.meta}</span>{/if}
            </li>
          {/each}
        </ul>
      {/if}
    </div>
  {/each}
</div>
