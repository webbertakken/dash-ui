<script module lang="ts">
  export type SwitchPortStatus = 'up' | 'poe' | 'down';
  export interface SwitchPort {
    status: SwitchPortStatus;
    speed?: string;
    label?: string;
  }
  const STATUS_LABEL: Record<SwitchPortStatus, string> = {
    up: 'Connected',
    poe: 'PoE Active',
    down: 'Down',
  };
</script>

<script lang="ts">
  interface Props {
    ports?: SwitchPort[];
    columns?: number;
    ariaLabel?: string;
    onportclick?: (payload: number) => void;
  }

  let {
    ports = [],
    columns = 12,
    ariaLabel = 'Switch port panel',
    onportclick,
  }: Props = $props();

  const STATUS_BTN: Record<SwitchPortStatus, string> = {
    up: 'border-status-success/40 bg-status-success/[0.08] text-status-success hover:bg-status-success/15',
    poe: 'border-status-warning/40 bg-status-warning/[0.10] text-status-warning hover:bg-status-warning/20',
    down: 'border-white/[0.08] bg-white/[0.02] text-[#6e7079] hover:bg-white/[0.04]',
  };
</script>

<ul
  class="m-0 grid list-none gap-1 p-0"
  role="list"
  aria-label={ariaLabel}
  style="grid-template-columns: repeat({columns}, 1fr);"
>
  {#each ports as port, i}
    {@const n = i + 1}
    {@const desc = `Port ${n}: ${STATUS_LABEL[port.status]}${port.speed ? ` · ${port.speed}` : ''}${port.label ? ` · ${port.label}` : ''}`}
    <li>
      <button
        type="button"
        data-status={port.status}
        aria-label={desc}
        class="flex aspect-square w-full cursor-pointer flex-col items-center justify-center gap-0.5 rounded border p-1 text-11 font-medium transition-colors duration-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-05 {STATUS_BTN[port.status]}"
        onclick={() => onportclick?.(i)}
      >
        <span class="font-bold leading-none">{n}</span>
        {#if port.speed}
          <span class="text-[9px] leading-none opacity-75">{port.speed}</span>
        {/if}
        {#if port.status === 'poe'}
          <span class="text-[9px] font-bold leading-none" aria-hidden="true">PoE</span>
        {/if}
      </button>
    </li>
  {/each}
</ul>
