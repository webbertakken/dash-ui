<script lang="ts">
  interface Props {
    text: string;
    label?: string;
  }

  let { text, label = 'Copy' }: Props = $props();

  let copied = $state(false);
  let timer: ReturnType<typeof setTimeout>;

  function handleCopy() {
    navigator.clipboard.writeText(text).then(() => {
      copied = true;
      clearTimeout(timer);
      timer = setTimeout(() => { copied = false; }, 2000);
    });
  }
</script>

<button
  type="button"
  data-copied={copied ? 'true' : undefined}
  aria-label={copied ? 'Copied!' : label}
  class="inline-flex h-[22px] w-[22px] shrink-0 cursor-pointer items-center justify-center rounded border-0 bg-transparent text-text-4 transition-[color,background-color] duration-100 hover:bg-row-hover hover:text-text-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-05 data-[copied=true]:text-status-success data-[copied=true]:hover:bg-status-success/10"
  onclick={handleCopy}
>
  {#if copied}
    <svg viewBox="0 0 14 14" width="14" height="14" fill="none" aria-hidden="true" focusable="false">
      <path d="M2.5 7.5l3.5 3.5L12 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  {:else}
    <svg viewBox="0 0 14 14" width="14" height="14" fill="none" aria-hidden="true" focusable="false">
      <rect x="4" y="1" width="9" height="10" rx="1.5" stroke="currentColor" stroke-width="1.5"/>
      <rect x="1" y="4" width="9" height="10" rx="1.5" stroke="currentColor" stroke-width="1.5"/>
    </svg>
  {/if}
</button>
