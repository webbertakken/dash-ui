<script lang="ts">
  import { onDestroy } from 'svelte';
  export let code: string = '';
  export let label: string = 'Code block';
  export let language: string = '';
  let className = '';
  export { className as class };

  let copied = false;
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

<div role="region" aria-label={label} class="code-block {className}">
  <div class="code-block__header">
    {#if language}
      <span class="code-block__lang">{language}</span>
    {:else}
      <span></span>
    {/if}
    <button
      type="button"
      class="copy-btn{copied ? ' copy-btn--done' : ''}"
      aria-label={copied ? 'Copied!' : 'Copy code'}
      on:click={handleCopy}
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
  <pre class="code-block__pre"><code class="code-block__code">{code}</code></pre>
</div>
