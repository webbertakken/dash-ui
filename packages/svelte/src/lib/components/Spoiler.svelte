<script lang="ts">
  import { onMount } from 'svelte';

  export let maxHeight: number = 80;
  export let showLabel: string = 'Show more';
  export let hideLabel: string = 'Show less';
  let klass: string = '';
  export { klass as class };

  let expanded = false;
  let clipped = false;
  let bodyEl: HTMLDivElement;

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
      <slot />
    </div>
    {#if !expanded && clipped}
      <div class="spoiler-fade" aria-hidden="true" />
    {/if}
  </div>
  {#if clipped}
    <button
      type="button"
      class="spoiler-toggle"
      aria-expanded={expanded}
      on:click={() => (expanded = !expanded)}
    >
      {expanded ? hideLabel : showLabel}
    </button>
  {/if}
</div>
