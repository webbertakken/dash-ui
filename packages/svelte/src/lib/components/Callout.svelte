<script context="module" lang="ts">
  export type CalloutVariant = 'info' | 'success' | 'warn' | 'danger' | 'tip';
</script>

<script lang="ts">
  export let variant: CalloutVariant = 'info';
  export let title: string | undefined = undefined;
</script>

<div class="callout callout--{variant}" role="note">
  {#if variant === 'info'}
    <svg class="callout-icon" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path fill-rule="evenodd" d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1ZM7.25 5.5a.75.75 0 1 1 1.5 0 .75.75 0 0 1-1.5 0ZM7 7.5h2v4H7v-4Z" />
    </svg>
  {:else if variant === 'success'}
    <svg class="callout-icon" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path fill-rule="evenodd" d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1Zm3.78 5.47-4.25 4.5a.75.75 0 0 1-1.06.03L4.72 9.22a.75.75 0 1 1 1.06-1.06l1.22 1.22 3.72-3.94a.75.75 0 1 1 1.06 1.03Z" />
    </svg>
  {:else if variant === 'warn'}
    <svg class="callout-icon" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path fill-rule="evenodd" d="M8.9 1.6a1 1 0 0 0-1.8 0L.6 13a1 1 0 0 0 .9 1.5h13a1 1 0 0 0 .9-1.5L8.9 1.6ZM7.25 6.5a.75.75 0 1 1 1.5 0v3a.75.75 0 0 1-1.5 0v-3Zm.75 6a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" />
    </svg>
  {:else if variant === 'danger'}
    <svg class="callout-icon" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path fill-rule="evenodd" d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1ZM5.97 5.97a.75.75 0 0 1 1.06 0L8 6.94l.97-.97a.75.75 0 1 1 1.06 1.06L9.06 8l.97.97a.75.75 0 0 1-1.06 1.06L8 9.06l-.97.97a.75.75 0 0 1-1.06-1.06L6.94 8l-.97-.97a.75.75 0 0 1 0-1.06Z" />
    </svg>
  {:else}
    <svg class="callout-icon" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M8 1a5 5 0 0 1 3 9.01V11H5v-.99A5 5 0 0 1 8 1Zm-1 12h2v1.5a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5V13Z" />
    </svg>
  {/if}
  <div class="callout-body">
    {#if title}
      <div class="callout-title">{title}</div>
    {/if}
    <div><slot /></div>
  </div>
</div>
