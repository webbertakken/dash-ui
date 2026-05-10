<script lang="ts">
  export let title: string;
  export let description: string | undefined = undefined;
  let className = '';
  export { className as class };
</script>

<div role="status" aria-live="polite" class="empty-state {className}">
  <svg class="empty-state__icon" viewBox="0 0 48 48" fill="none" aria-hidden="true" focusable="false">
    <rect x="6" y="11" width="36" height="28" rx="4" stroke="currentColor" stroke-width="1.5"/>
    <path d="M6 30h10l3 5h10l3-5h10" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
    <path d="M15 20h18M15 25h12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" opacity=".4"/>
  </svg>
  <p class="empty-state__title">{title}</p>
  {#if description}
    <p class="empty-state__desc">{description}</p>
  {/if}
  {#if $$slots.action}
    <div class="empty-state__action"><slot name="action" /></div>
  {/if}
</div>
