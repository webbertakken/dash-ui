<script lang="ts">
  interface Props {
    items?: unknown[];
    itemHeight?: number;
    height?: number;
    label?: string | undefined;
    overscan?: number;
    children?: import('svelte').Snippet<[any]>;
  }

  let {
    items = [],
    itemHeight = 48,
    height = 400,
    label = undefined,
    overscan = 3,
    children
  }: Props = $props();

  let scrollTop = $state(0);

  let totalHeight = $derived(items.length * itemHeight);
  let firstVisible = $derived(Math.floor(scrollTop / itemHeight));
  let startIndex = $derived(Math.max(0, firstVisible - overscan));
  let endIndex = $derived(Math.min(items.length, firstVisible + Math.ceil(height / itemHeight) + overscan + 1));
  let visible = $derived(items.slice(startIndex, endIndex).map((item, i) => ({ item, index: startIndex + i })));
</script>

<div
  role="list"
  aria-label={label}
  class="vl"
  style:height="{height}px"
  style:overflow-y="auto"
  onscroll={(e) => (scrollTop = e.currentTarget.scrollTop)}
>
  <div style:height="{totalHeight}px" style:position="relative">
    <div style:position="absolute" style:top="{startIndex * itemHeight}px" style:width="100%">
      {#each visible as { item, index } (index)}
        <div
          role="listitem"
          style:height="{itemHeight}px"
          style:overflow="hidden"
        >
          {@render children?.({ item, index, })}
        </div>
      {/each}
    </div>
  </div>
</div>
