<script lang="ts">
  export interface RankedItem {
    label: string;
    value: number;
    sublabel?: string;
    color?: string;
  }

  export let items: RankedItem[];
  export let unit: string | undefined = undefined;
  export let max: number | undefined = undefined;
  export let ariaLabel: string = 'Ranked list';

  $: resolvedMax = max ?? Math.max(...items.map((i) => i.value), 1);
</script>

<table class="rl" aria-label={ariaLabel}>
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
      <tr class="rl-row">
        <td class="rl-rank">{i + 1}</td>
        <td class="rl-label-cell">
          <div class="rl-label">{item.label}</div>
          {#if item.sublabel}<div class="rl-sublabel">{item.sublabel}</div>{/if}
        </td>
        <td class="rl-bar-col" aria-hidden="true">
          <div class="rl-bar-track">
            <div
              class="rl-bar-fill"
              style="width:{((item.value / resolvedMax) * 100).toFixed(1)}%;background:{item.color ?? '#006FFF'}"
            ></div>
          </div>
        </td>
        <td class="rl-val">
          {item.value.toLocaleString()}{#if unit}<span class="rl-unit"> {unit}</span>{/if}
        </td>
      </tr>
    {/each}
  </tbody>
</table>
