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
    children
  }: Props = $props();
</script>

{#if count > 0}
  <div class="sel-toolbar" role="toolbar" aria-label={ariaLabel}>
    <span class="sel-toolbar__count" aria-live="polite" aria-atomic="true">
      <strong>{count}</strong> selected
    </span>
    <div class="sel-toolbar__actions">
      {#each actions as action}
        <button
          type="button"
          class="sel-toolbar__btn{action.variant === 'danger' ? ' sel-toolbar__btn--danger' : ''}"
          onclick={action.onClick}
        >
          {action.label}
        </button>
      {/each}
      {@render children?.()}
    </div>
    <button
      type="button"
      class="sel-toolbar__clear icon-btn"
      onclick={onClear}
      aria-label="Clear selection"
    >
      <CloseIcon />
    </button>
  </div>
{/if}
