<script module lang="ts">
  export interface RankedItem {
    label: string;
    value: number;
    sublabel?: string;
    color?: string;
  }
</script>

<script lang="ts">
  interface Props {
    items: RankedItem[];
    unit?: string | undefined;
    max?: number | undefined;
    ariaLabel?: string;
  }

  let { items, unit = undefined, max = undefined, ariaLabel = 'Ranked list' }: Props = $props();

  let resolvedMax = $derived(max ?? Math.max(...items.map((i) => i.value), 1));
</script>

<table class="w-full border-collapse text-13" aria-label={ariaLabel}>
  <caption class="sr-only">{ariaLabel}</caption>
  <thead class="sr-only">
    <tr>
      <th scope="col">#</th>
      <th scope="col">Name</th>
      <th scope="col">Distribution</th>
      <th scope="col">{unit ?? 'Value'}</th>
    </tr>
  </thead>
  <tbody>
    {#each items as item, i}
      <tr class="border-b border-border-1 last:border-b-0">
        <td class="w-8 py-1.5 text-12 text-text-4 tabular-nums">{i + 1}</td>
        <td class="py-1.5 pr-3">
          <div class="text-text-2">{item.label}</div>
          {#if item.sublabel}<div class="text-11 text-text-4">{item.sublabel}</div>{/if}
        </td>
        <td class="w-1/3 py-1.5 pr-3" aria-hidden="true">
          <div class="h-1.5 w-full overflow-hidden rounded-sm bg-row-active">
            <div
              class="h-full rounded-sm"
              style="width:{((item.value / resolvedMax) * 100).toFixed(1)}%;background:{item.color ?? '#006FFF'}"
            ></div>
          </div>
        </td>
        <td class="py-1.5 text-right font-medium text-text-1 tabular-nums">
          {item.value.toLocaleString()}{#if unit}<span class="ml-1 text-11 text-text-4"> {unit}</span>{/if}
        </td>
      </tr>
    {/each}
  </tbody>
</table>
