<script context="module" lang="ts">
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
  import { createEventDispatcher } from 'svelte';
  export let ports: SwitchPort[] = [];
  export let columns: number = 12;
  export let ariaLabel: string = 'Switch port panel';
  const dispatch = createEventDispatcher<{ portclick: number }>();
</script>

<ul class="spg" role="list" aria-label={ariaLabel} style="grid-template-columns: repeat({columns}, 1fr);">
  {#each ports as port, i}
    {@const n = i + 1}
    {@const desc = `Port ${n}: ${STATUS_LABEL[port.status]}${port.speed ? ` · ${port.speed}` : ''}${port.label ? ` · ${port.label}` : ''}`}
    <li>
      <button
        type="button"
        class="spg__btn"
        data-status={port.status}
        aria-label={desc}
        on:click={() => dispatch('portclick', i)}
      >
        <span class="spg__num">{n}</span>
        {#if port.speed}
          <span class="spg__speed--{port.status}">{port.speed}</span>
        {/if}
        {#if port.status === 'poe'}
          <span class="spg__poe" aria-hidden="true">PoE</span>
        {/if}
      </button>
    </li>
  {/each}
</ul>
