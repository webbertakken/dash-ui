<script lang="ts">
  interface Props {
    title: string;
    defaultOpen?: boolean;
    children?: import('svelte').Snippet;
  }

  let { title, defaultOpen = false, children }: Props = $props();

  let open = $state(defaultOpen);
  const uid = Math.random().toString(36).slice(2, 9);
  const btnId = `acc-btn-${uid}`;
  const panelId = `acc-panel-${uid}`;
</script>

<div class="accordion-item">
  <h3 class="accordion-header">
    <button
      id={btnId}
      type="button"
      class="accordion-trigger"
      aria-expanded={open}
      aria-controls={panelId}
      onclick={() => (open = !open)}
    >
      <span>{title}</span>
      <svg
        class="accordion-chevron"
        class:open
        viewBox="0 0 16 16"
        fill="none"
        aria-hidden="true"
      >
        <path d="M4 6l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </button>
  </h3>
  {#if open}
    <div id={panelId} role="region" aria-labelledby={btnId} class="accordion-panel">
      <div class="accordion-content">
        {@render children?.()}
      </div>
    </div>
  {/if}
</div>
