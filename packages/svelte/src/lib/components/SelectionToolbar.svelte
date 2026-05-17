<script module lang="ts">
  export interface SelectionToolbarAction {
    label: string;
    onClick: () => void;
    variant?: 'default' | 'danger';
  }
</script>

<script lang="ts">
  import CloseIcon from '../icons/CloseIcon.svelte';

  interface Props {
    count: number;
    actions?: SelectionToolbarAction[];
    onClear: () => void;
    ariaLabel?: string;
    children?: import('svelte').Snippet;
  }

  let {
    count,
    actions = [],
    onClear,
    ariaLabel = 'Selection actions',
    children,
  }: Props = $props();
</script>

{#if count > 0}
  <div
    role="toolbar"
    aria-label={ariaLabel}
    class="flex items-center gap-3 rounded-lg border border-brand-05/25 bg-brand-05/[0.08] px-4 py-2 text-13 text-text-2"
  >
    <span class="whitespace-nowrap" aria-live="polite" aria-atomic="true">
      <strong class="text-text-1">{count}</strong> selected
    </span>
    <div class="flex flex-1 items-center gap-2">
      {#each actions as action}
        <button
          type="button"
          data-danger={action.variant === 'danger' ? 'true' : undefined}
          class="inline-flex h-7 cursor-pointer items-center rounded border border-border-2 bg-row-hover px-2.5 text-12 font-medium text-text-2 transition-colors duration-100 hover:border-border-3 hover:bg-row-active hover:text-text-1 data-[danger=true]:border-status-danger/30 data-[danger=true]:text-status-danger data-[danger=true]:hover:bg-status-danger/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-05"
          onclick={action.onClick}
        >
          {action.label}
        </button>
      {/each}
      {@render children?.()}
    </div>
    <button
      type="button"
      aria-label="Clear selection"
      class="inline-flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded border-0 bg-transparent text-text-4 hover:bg-row-active hover:text-text-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-05"
      onclick={onClear}
    >
      <CloseIcon />
    </button>
  </div>
{/if}
