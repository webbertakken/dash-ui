<script lang="ts">
  interface Props {
    keys: string | string[];
    class?: string;
  }

  let { keys, class: className = '' }: Props = $props();

  let parts = $derived(typeof keys === 'string' ? keys.split('+') : keys);
</script>

<kbd class="inline-flex shrink-0 items-center gap-px font-mono text-[11px] leading-none {className}">
  {#each parts as key, i}
    <span class="inline-flex items-center gap-0.5">
      {#if i > 0}
        <span class="px-px font-sans text-[10px] leading-none text-text-4" aria-hidden="true">+</span>
      {/if}
      <kbd
        class="inline-flex min-w-[18px] items-center justify-center rounded border border-b-2 border-border-3 bg-row-active px-1.5 py-0.5 font-[inherit] text-text-3 [box-shadow:0_1px_0_rgba(0,0,0,0.4)]"
      >{key}</kbd>
    </span>
  {/each}
</kbd>
