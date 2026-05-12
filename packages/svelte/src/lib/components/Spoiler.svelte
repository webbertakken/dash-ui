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
    children
  }: Props = $props();
  

  let expanded = $state(false);
  let clipped = $state(false);
  let bodyEl: HTMLDivElement = $state();

  onMount(() => {
    if (bodyEl) clipped = bodyEl.scrollHeight > maxHeight;
  });
</script>

<div class="spoiler {klass}">
  <div class="spoiler-outer" style="position:relative">
    <div
      bind:this={bodyEl}
      style={!expanded && clipped ? `max-height:${maxHeight}px;overflow:hidden` : undefined}
    >
      {@render children?.()}
    </div>
    {#if !expanded && clipped}
      <div class="spoiler-fade" aria-hidden="true"></div>
    {/if}
  </div>
  {#if clipped}
    <button
      type="button"
      class="spoiler-toggle"
      aria-expanded={expanded}
      onclick={() => (expanded = !expanded)}
    >
      {expanded ? hideLabel : showLabel}
    </button>
  {/if}
</div>
