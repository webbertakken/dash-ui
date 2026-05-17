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

  $effect(() => {
    void items.length;
    if (autoScroll && endEl) endEl.scrollIntoView({ block: 'nearest' });
  });

  const SEVERITY_DOT: Record<ActivitySeverity, string> = {
    info: 'bg-brand-05',
    success: 'bg-status-success',
    warn: 'bg-status-warning',
    error: 'bg-status-danger',
    neutral: 'bg-status-neutral',
  };
</script>

<div
  role="feed"
  aria-label={label}
  aria-busy={busy}
  class="flex flex-col gap-1 overflow-y-auto"
  style:max-height="{maxHeight}px"
>
  {#each items as item, i (item.id)}
    {@const sev = item.severity ?? 'neutral'}
    <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
    <article
      aria-labelledby="af-title-{item.id}"
      aria-describedby={item.description ? `af-desc-${item.id}` : undefined}
      aria-posinset={i + 1}
      aria-setsize={items.length}
      tabindex={0}
      class="flex items-start gap-2 rounded-md px-2 py-1.5 text-13 hover:bg-divider focus-visible:bg-row-hover focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-brand-05"
    >
      <div class="mt-1.5 h-2 w-2 shrink-0 rounded-full {SEVERITY_DOT[sev]}" aria-hidden="true"></div>
      <div class="min-w-0 flex-1">
        <div class="flex items-baseline justify-between gap-2">
          <span id="af-title-{item.id}" class="truncate font-medium text-text-1">{item.title}</span>
          <span class="shrink-0 text-11 text-text-4 tabular-nums">{item.time}</span>
        </div>
        {#if item.description}
          <p id="af-desc-{item.id}" class="m-0 mt-0.5 text-12 text-text-3">{item.description}</p>
        {/if}
      </div>
    </article>
  {/each}
  {#if items.length === 0}
    <div class="py-6 text-center text-12 text-text-4" role="status">No activity</div>
  {/if}
  <div bind:this={endEl}></div>
</div>
