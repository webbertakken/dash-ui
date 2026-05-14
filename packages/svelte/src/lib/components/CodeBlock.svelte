<script lang="ts">
  import { onDestroy } from 'svelte';

  interface Props {
    code?: string;
    label?: string;
    language?: string;
    class?: string;
  }

  let {
    code = '',
    label = 'Code block',
    language = '',
    class: className = '',
  }: Props = $props();

  let copied = $state(false);
  let timer: ReturnType<typeof setTimeout> | null = null;

  function handleCopy() {
    navigator.clipboard.writeText(code).then(() => {
      copied = true;
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => { copied = false; }, 2000);
    });
  }

  onDestroy(() => { if (timer) clearTimeout(timer); });
</script>

<div role="region" aria-label={label} class="overflow-hidden rounded-lg border border-white/10 bg-[#0a0a0b] {className}">
  <div class="flex min-h-8 items-center justify-between border-b border-white/[0.07] bg-[#111113] py-1.5 pl-3 pr-2">
    {#if language}
      <span class="font-mono text-11 uppercase tracking-[0.05em] text-[#6e7079]">{language}</span>
    {:else}
      <span></span>
    {/if}
    <button
      type="button"
      data-copied={copied ? 'true' : undefined}
      aria-label={copied ? 'Copied!' : 'Copy code'}
      class="inline-flex h-[22px] w-[22px] shrink-0 cursor-pointer items-center justify-center rounded border-0 bg-transparent text-[#6e7079] transition-[color,background-color] duration-100 hover:bg-white/[0.04] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-05 data-[copied=true]:text-status-success data-[copied=true]:hover:bg-status-success/10 data-[copied=true]:hover:text-[#5ddb9f]"
      onclick={handleCopy}
    >
      {#if copied}
        <svg viewBox="0 0 14 14" width="14" height="14" fill="none" aria-hidden="true" focusable="false">
          <path d="M2.5 7.5l3.5 3.5L12 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      {:else}
        <svg viewBox="0 0 14 14" width="14" height="14" fill="none" aria-hidden="true" focusable="false">
          <rect x="4" y="1" width="9" height="10" rx="1.5" stroke="currentColor" stroke-width="1.5" />
          <rect x="1" y="4" width="9" height="10" rx="1.5" stroke="currentColor" stroke-width="1.5" />
        </svg>
      {/if}
    </button>
  </div>
  <pre class="m-0 overflow-x-auto px-3.5 py-3"><code class="whitespace-pre font-mono text-12 leading-[1.6] text-[#c8c9d0]">{code}</code></pre>
</div>
