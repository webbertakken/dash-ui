<script lang="ts">
  /**
   * SvelteFlow node that frames a group's tree as a fieldset: a
   * rectangle spanning the lane, a header band with the group logo +
   * label + reachable/total count + a rollup pill, sitting BEHIND the
   * component cards (zIndex 0). The component tree itself is rendered by
   * the surrounding canvas; this node is purely chrome.
   */
  import { Pill } from '@w5-ui/svelte'
  import type { GroupAccent, GroupId, Status } from '../types.ts'

  let {
    data,
  }: {
    data: {
      groupId: GroupId
      label: string
      logo: string
      rollup: Status
      reachable: number
      total: number
      width: number
      height: number
      accent?: GroupAccent
      /** Optional colour-only clamp for the pill (label stays truthful). */
      displayRollup?: Status
    }
  } = $props()

  const pillVariant = (s: Status): 'success' | 'warn' | 'danger' | 'neutral' => {
    if (s === 'up') return 'success'
    if (s === 'degraded') return 'warn'
    if (s === 'down') return 'danger'
    return 'neutral'
  }

  const variantForRollup = $derived(pillVariant(data.displayRollup ?? data.rollup))
  const border = $derived(data.accent?.border ?? 'border-border-2')
  const tint = $derived(data.accent?.tint ?? '')
</script>

<fieldset
  class="m-0 box-border rounded-2xl border-2 {border} bg-gradient-to-b {tint} p-0 shadow-modal"
  style="width:{data.width}px; height:{data.height}px;"
  data-testid={`fieldset-${data.groupId}`}
>
  <legend
    class="ml-5 flex items-center gap-2 rounded-md border border-border-2 bg-bg-1 px-3 py-1.5"
  >
    {#if data.logo}
      <img src={data.logo} alt="" class="h-5 w-5 rounded-sm object-contain" aria-hidden="true" />
    {/if}
    <span class="text-12 font-semibold uppercase tracking-[0.08em] text-text-2">{data.label}</span>
    <span class="text-11 tabular-nums text-text-4">
      {data.reachable}/{data.total}
    </span>
    <Pill variant={variantForRollup}>{data.rollup}</Pill>
  </legend>
</fieldset>
