<script lang="ts">
  import { onMount } from 'svelte';

  interface Props {
    maxHeight?: number;
    showLabel?: string;
    hideLabel?: string;
    class?: string;
    children?: import('svelte').Snippet;
  }

  let {
    maxHeight = 80,
    showLabel = 'Show more',
    hideLabel = 'Show less',
    class: klass = '',
    children,
  }: Props = $props();

  let expanded = $state(false);
  let clipped = $state(false);
  let bodyEl = $state<HTMLDivElement | undefined>(undefined);

  onMount(() => {
    if (bodyEl) clipped = bodyEl.scrollHeight > maxHeight;
  });
</script>

<div class="flex flex-col {klass}">
  <div class="relative">
    <div
      bind:this={bodyEl}
      style={!expanded && clipped ? `max-height:${maxHeight}px;overflow:hidden` : undefined}
    >
      {@render children?.()}
    </div>
    {#if !expanded && clipped}
      <div
        class="pointer-events-none absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-b from-transparent to-[#1a1d23]"
        aria-hidden="true"
      ></div>
    {/if}
  </div>
  {#if clipped}
    <button
      type="button"
      aria-expanded={expanded}
      class="mt-1 inline-flex items-center border-0 bg-transparent px-0 py-1 text-12 leading-none text-brand-05 cursor-pointer hover:text-status-info focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-05"
      onclick={() => (expanded = !expanded)}
    >
      {expanded ? hideLabel : showLabel}
    </button>
  {/if}
</div>
