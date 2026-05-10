<script lang="ts">
  export let text: string;
  export let label: string = 'Copy';

  let copied = false;
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
  class="copy-btn {copied ? 'copy-btn--done' : ''}"
  aria-label={copied ? 'Copied!' : label}
  on:click={handleCopy}
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
