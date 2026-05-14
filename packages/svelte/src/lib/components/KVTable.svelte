<script lang="ts">
  interface Props {
    rows?: Array<{ label: string; value: string; valueColor?: string }>;
    caption?: string | undefined;
  }

  let { rows = [], caption = undefined }: Props = $props();
</script>

<table class="w-full border-collapse text-13">
  {#if caption}
    <caption class="sr-only">{caption}</caption>
  {/if}
  <tbody>
    {#each rows as { label, value, valueColor }}
      <tr class="border-b border-white/[0.06] last:border-b-0">
        <th
          scope="row"
          class="w-2/5 whitespace-nowrap py-1.5 pr-3 text-left align-top font-medium text-text-3"
        >{label}</th>
        <td
          class="py-1.5 align-top text-[#e1e2e8] break-words"
          style={valueColor ? `color:${valueColor}` : undefined}
        >{value}</td>
      </tr>
    {/each}
  </tbody>
</table>
