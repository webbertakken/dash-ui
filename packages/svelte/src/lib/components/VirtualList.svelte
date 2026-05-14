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
    children,
  }: Props = $props();

  let scrollTop = $state(0);

  let totalHeight = $derived(items.length * itemHeight);
  let firstVisible = $derived(Math.floor(scrollTop / itemHeight));
  let startIndex = $derived(Math.max(0, firstVisible - overscan));
  let endIndex = $derived(
    Math.min(items.length, firstVisible + Math.ceil(height / itemHeight) + overscan + 1),
  );
  let visible = $derived(
    items.slice(startIndex, endIndex).map((item, i) => ({ item, index: startIndex + i })),
  );
</script>

<div
  role="list"
  aria-label={label}
  class="relative overflow-y-auto"
  style:height="{height}px"
  onscroll={(e) => (scrollTop = e.currentTarget.scrollTop)}
>
  <div class="relative" style:height="{totalHeight}px">
    <div class="absolute left-0 right-0" style:top="{startIndex * itemHeight}px">
      {#each visible as { item, index } (index)}
        <div
          role="listitem"
          class="overflow-hidden"
          style:height="{itemHeight}px"
        >
          {@render children?.({ item, index })}
        </div>
      {/each}
    </div>
  </div>
</div>
