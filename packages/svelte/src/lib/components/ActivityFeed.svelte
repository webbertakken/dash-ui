<script module lang="ts">
  export type ActivitySeverity = 'info' | 'success' | 'warn' | 'error' | 'neutral';
  export interface ActivityItem {
    id: string;
    title: string;
    description?: string;
    time: string;
    severity?: ActivitySeverity;
  }
</script>

<script lang="ts">
  interface Props {
    items?: ActivityItem[];
    label?: string;
    busy?: boolean;
    maxHeight?: number;
    autoScroll?: boolean;
  }

  let {
    items = [],
    label = 'Activity feed',
    busy = false,
    maxHeight = 360,
    autoScroll = false,
  }: Props = $props();

  let endEl = $state<HTMLDivElement | undefined>(undefined);

  // Replaces `afterUpdate`. Reading `items.length` makes the effect depend
  // on the visible list so we re-scroll whenever an item is appended.
  $effect(() => {
    void items.length;
    if (autoScroll && endEl) endEl.scrollIntoView({ block: 'nearest' });
  });
</script>

<div
  role="feed"
  aria-label={label}
  aria-busy={busy}
  class="activity-feed"
  style:max-height="{maxHeight}px"
  style:overflow-y="auto"
>
  {#each items as item, i (item.id)}
    <!-- svelte-ignore a11y_no_noninteractive_tabindex - navigable feed item for keyboard users -->
    <article
      class="af-item af-item--{item.severity ?? 'neutral'}"
      aria-labelledby="af-title-{item.id}"
      aria-describedby={item.description ? `af-desc-${item.id}` : undefined}
      aria-posinset={i + 1}
      aria-setsize={items.length}
      tabindex="0"
    >
      <div class="af-dot" aria-hidden="true"></div>
      <div class="af-body">
        <div class="af-header">
          <span id="af-title-{item.id}" class="af-title">{item.title}</span>
          <span class="af-time">{item.time}</span>
        </div>
        {#if item.description}
          <p id="af-desc-{item.id}" class="af-desc">{item.description}</p>
        {/if}
      </div>
    </article>
  {/each}
  {#if items.length === 0}
    <div class="af-empty" role="status">No activity</div>
  {/if}
  <div bind:this={endEl}></div>
</div>
