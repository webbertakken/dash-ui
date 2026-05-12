<script context="module" lang="ts">
  export interface SelectionToolbarAction {
    label: string;
    onClick: () => void;
    variant?: 'default' | 'danger';
  }
</script>

<script lang="ts">
  import CloseIcon from '../icons/CloseIcon.svelte';


  export let count: number;
  export let actions: SelectionToolbarAction[] = [];
  export let onClear: () => void;
  export let ariaLabel: string = 'Selection actions';
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
          on:click={action.onClick}
        >
          {action.label}
        </button>
      {/each}
      <slot />
    </div>
    <button
      type="button"
      class="sel-toolbar__clear icon-btn"
      on:click={onClear}
      aria-label="Clear selection"
    >
      <CloseIcon />
    </button>
  </div>
{/if}
