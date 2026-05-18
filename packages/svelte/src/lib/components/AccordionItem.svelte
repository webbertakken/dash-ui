<script lang="ts">
  interface Props {
    title: string;
    defaultOpen?: boolean;
    children?: import('svelte').Snippet;
  }

  let { title, defaultOpen = false, children }: Props = $props();

  // svelte-ignore state_referenced_locally
  let open = $state(defaultOpen);
  const uid = Math.random().toString(36).slice(2, 9);
  const btnId = `acc-btn-${uid}`;
  const panelId = `acc-panel-${uid}`;
</script>

<div class="border-b border-border-1 last:border-b-0">
  <h3 class="m-0">
    <button
      id={btnId}
      type="button"
      aria-expanded={open}
      aria-controls={panelId}
      class="flex w-full cursor-pointer items-center justify-between gap-2.5 border-0 bg-transparent py-2.5 text-left text-13 font-medium leading-[1.4] text-text-1 transition-colors duration-100 hover:text-text-link focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-05"
      onclick={() => (open = !open)}
    >
      <span>{title}</span>
      <svg
        viewBox="0 0 16 16"
        fill="none"
        aria-hidden="true"
        class="h-3.5 w-3.5 shrink-0 text-text-4 transition-transform duration-200 motion-reduce:transition-none {open ? 'rotate-180' : ''}"
      >
        <path d="M4 6l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </button>
  </h3>
  {#if open}
    <div id={panelId} role="region" aria-labelledby={btnId}>
      <div class="pb-2.5">
        {@render children?.()}
      </div>
    </div>
  {/if}
</div>
