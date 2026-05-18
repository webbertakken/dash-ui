<script lang="ts">
  interface Props {
    title: string;
    description?: string | undefined;
    class?: string;
    action?: import('svelte').Snippet;
  }

  let {
    title,
    description = undefined,
    class: className = '',
    action,
  }: Props = $props();
</script>

<div
  role="status"
  aria-live="polite"
  class="flex flex-col items-center justify-center gap-2.5 px-6 py-12 text-center {className}"
>
  <svg
    class="h-12 w-12 shrink-0 text-border-3"
    viewBox="0 0 48 48"
    fill="none"
    aria-hidden="true"
    focusable="false"
  >
    <rect x="6" y="11" width="36" height="28" rx="4" stroke="currentColor" stroke-width="1.5"/>
    <path d="M6 30h10l3 5h10l3-5h10" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
    <path d="M15 20h18M15 25h12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" opacity=".4"/>
  </svg>
  <p class="m-0 text-14 font-medium text-text-3">{title}</p>
  {#if description}
    <p class="m-0 max-w-[280px] text-12 leading-[1.5] text-text-4">{description}</p>
  {/if}
  {#if action}
    <div class="mt-1.5">{@render action?.()}</div>
  {/if}
</div>
