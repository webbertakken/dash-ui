<script lang="ts">
  /**
   * Card node for the fleet board's SvelteFlow graph. Compact dark card
   * with a kind-driven icon, label, sub-meta line, a status dot, an
   * optional "open in new tab" affordance, and an optional chip strip
   * (consumer-supplied via the layout's `cardExtras`).
   */
  import { Handle, Position } from '@xyflow/svelte'
  import type { Status } from '../types.ts'
  import type { CardChip } from '../topology-layout.ts'
  import KindIcon from './KindIcon.svelte'
  import type { Component } from '../types.ts'

  let {
    data,
  }: {
    data: {
      component: Component
      status: Status
      decommissioned: boolean
      subtitle?: string
      openUrl?: string | null
      chips?: CardChip[]
      /** Optional consumer clamp for colour only (semantic status stays). */
      displayStatus?: Status
    }
  } = $props()

  const DOT: Record<Status, string> = {
    up: 'bg-status-success',
    degraded: 'bg-status-warning',
    down: 'bg-status-danger',
    unknown: 'bg-status-neutral',
  }
  const BORDER: Record<Status, string> = {
    up: 'border-border-2 hover:border-status-success/60',
    degraded: 'border-status-warning/60',
    down: 'border-status-danger/70',
    unknown: 'border-border-2',
  }

  const colourStatus = $derived(data.displayStatus ?? data.status)

  const CHIPS_VISIBLE = 3
  const chips = $derived(data.chips ?? [])
  const visibleChips = $derived(chips.slice(0, CHIPS_VISIBLE))
  const overflowCount = $derived(Math.max(0, chips.length - CHIPS_VISIBLE))
  const openUrl = $derived(data.openUrl ?? null)
</script>

<div
  class="relative box-border flex w-[240px] flex-col gap-1 rounded-md border bg-bg-1 px-3 py-2 text-text-1 shadow-modal transition-colors duration-150
    {chips.length > 0 ? 'min-h-[92px]' : 'h-[92px]'}
    {BORDER[colourStatus]}
    {data.decommissioned ? 'border-dashed opacity-55' : ''}"
>
  <Handle type="target" position={Position.Top} class="!h-2 !w-2 !border-0 !bg-border-2" />

  <div class="flex min-w-0 items-center gap-2">
    <span
      class="inline-flex h-5 w-5 shrink-0 items-center justify-center text-text-3"
      aria-hidden="true"
    >
      <KindIcon kind={data.component.kind} class="h-5 w-5" />
    </span>
    <span
      class="min-w-0 flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-13 font-semibold text-text-1"
      title={data.component.label}>{data.component.label}</span
    >
    {#if openUrl}
      <a
        href={openUrl}
        target="_blank"
        rel="noopener noreferrer"
        data-testid="card-open-url"
        class="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-sm text-text-3 transition-colors hover:bg-bg-2 hover:text-text-1"
        aria-label={`Open ${data.component.label} in a new tab`}
        title={openUrl}
        onclick={(e) => e.stopPropagation()}
      >
        <svg
          class="h-3.5 w-3.5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          aria-hidden="true"
        >
          <path
            d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path d="M15 3h6v6M10 14L21 3" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </a>
    {/if}
    <span
      class="h-2.5 w-2.5 shrink-0 rounded-full ring-2 ring-current/30 {DOT[colourStatus]}"
      aria-hidden="true"
    ></span>
  </div>
  <div class="flex items-center gap-2 text-11 leading-tight text-text-3">
    <span
      class="overflow-hidden text-ellipsis whitespace-nowrap font-mono"
      title={data.subtitle ?? `${data.component.zone} · ${data.component.kind}`}
    >
      {data.subtitle ?? `${data.component.zone} · ${data.component.kind}`}
    </span>
  </div>

  {#if chips.length > 0}
    <ul
      class="m-0 flex list-none flex-wrap items-center gap-1 p-0"
      aria-label="Instances"
    >
      {#each visibleChips as chip, i (i)}
        <li
          data-testid={`card-chip-${i}`}
          class="inline-flex items-center rounded-sm border border-border-2 bg-bg-2 px-1.5 py-px font-mono text-[10px] leading-[1.3] text-text-2"
          title={chip.title ?? chip.label}
        >
          {chip.label}
        </li>
      {/each}
      {#if overflowCount > 0}
        <li
          data-testid="card-chip-overflow"
          class="inline-flex items-center rounded-sm border border-border-2 bg-bg-2 px-1.5 py-px font-mono text-[10px] leading-[1.3] text-text-3"
          title={`${overflowCount} more`}
        >
          +{overflowCount}
        </li>
      {/if}
    </ul>
  {/if}

  <Handle type="source" position={Position.Bottom} class="!h-2 !w-2 !border-0 !bg-border-2" />
</div>
