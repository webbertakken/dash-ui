<script lang="ts">
  interface Props {
    rows?: Array<{ label: string; value: string; valueColor?: string }>;
    caption?: string | undefined;
  }

  let { rows = [], caption = undefined }: Props = $props();
</script>

<table class="kv-table">
  {#if caption}
    <caption class="sr-only">{caption}</caption>
  {/if}
  <tbody>
    {#each rows as { label, value, valueColor }}
      <tr class="kv-table__row">
        <th scope="row" class="kv-table__label">{label}</th>
        <td class="kv-table__value" style={valueColor ? `color:${valueColor}` : undefined}>{value}</td>
      </tr>
    {/each}
  </tbody>
</table>
