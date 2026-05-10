<script lang="ts">
  export let items: unknown[] = [];
  export let itemHeight: number = 48;
  export let height: number = 400;
  export let label: string | undefined = undefined;
  export let overscan: number = 3;

  let scrollTop = 0;

  $: totalHeight = items.length * itemHeight;
  $: firstVisible = Math.floor(scrollTop / itemHeight);
  $: startIndex = Math.max(0, firstVisible - overscan);
  $: endIndex = Math.min(items.length, firstVisible + Math.ceil(height / itemHeight) + overscan + 1);
  $: visible = items.slice(startIndex, endIndex).map((item, i) => ({ item, index: startIndex + i }));
</script>

<div
  role="list"
  aria-label={label}
  class="vl"
  style:height="{height}px"
  style:overflow-y="auto"
  on:scroll={(e) => (scrollTop = e.currentTarget.scrollTop)}
>
  <div style:height="{totalHeight}px" style:position="relative">
    <div style:position="absolute" style:top="{startIndex * itemHeight}px" style:width="100%">
      {#each visible as { item, index } (index)}
        <div
          role="listitem"
          style:height="{itemHeight}px"
          style:overflow="hidden"
        >
          <slot {item} {index} />
        </div>
      {/each}
    </div>
  </div>
</div>
