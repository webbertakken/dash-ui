<script module lang="ts">
  export interface LogEntry {
    id?: string;
    timestamp: string;
    level: 'info' | 'warn' | 'error' | 'debug';
    category?: string;
    event: string;
    subject?: string;
    detail?: string;
  }
</script>

<script lang="ts">
  interface Props {
    entries?: LogEntry[];
    height?: number;
    defaultFollow?: boolean;
    ariaLabel?: string;
    className?: string;
  }

  let {
    entries = [],
    height = 360,
    defaultFollow = true,
    ariaLabel = 'Log entries',
    className = '',
  }: Props = $props();

  // svelte-ignore state_referenced_locally
  let follow = $state(defaultFollow);
  let bodyEl = $state<HTMLDivElement | undefined>(undefined);

  const SEV_DOT: Record<string, string> = {
    error: '#F03A3A',
    warn: '#F5A623',
    info: '#006FFF',
    debug: '#4A4B53',
  };
  const SEV_TXT: Record<string, string> = {
    error: 'text-status-danger',
    warn: 'text-status-warning',
    info: 'text-brand-05',
    debug: 'text-[#6e7079]',
  };

  $effect(() => {
    void entries.length;
    if (follow && bodyEl) bodyEl.scrollTop = bodyEl.scrollHeight;
  });
</script>

<div class="flex flex-col gap-1 rounded-lg border border-white/[0.06] bg-[#0a0a0b] {className}">
  <div class="flex items-center justify-between border-b border-white/[0.06] px-3 py-1.5 text-12 text-[#6e7079]">
    <span class="tabular-nums">{entries.length} entries</span>
    <button
      type="button"
      data-on={follow ? 'true' : undefined}
      aria-pressed={follow}
      class="inline-flex h-6 cursor-pointer items-center rounded border border-white/10 bg-transparent px-2 text-12 text-text-3 transition-colors duration-100 hover:bg-white/[0.04] hover:text-white data-[on=true]:border-brand-05 data-[on=true]:bg-brand-05/[0.10] data-[on=true]:text-brand-05 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-05"
      onclick={() => { follow = !follow; }}
    >Follow</button>
  </div>
  <div
    bind:this={bodyEl}
    role="log"
    aria-live="polite"
    aria-label={ariaLabel}
    class="overflow-auto"
    style="height:{height}px;"
  >
    <table class="w-full border-collapse font-mono text-12">
      <caption class="sr-only">{ariaLabel}</caption>
      <thead class="sr-only">
        <tr>
          <th scope="col">Severity</th>
          <th scope="col">Source</th>
          <th scope="col">Time</th>
          <th scope="col">Event</th>
          <th scope="col">Subject</th>
          <th scope="col">Detail</th>
        </tr>
      </thead>
      <tbody>
        {#each entries as e, i (e.id ?? i)}
          <tr class="border-b border-white/[0.03] last:border-b-0 hover:bg-white/[0.02]">
            <td class="whitespace-nowrap py-1 pl-3 pr-2">
              <span class="inline-flex items-center gap-1 {SEV_TXT[e.level] ?? SEV_TXT.info}">
                <span class="inline-block h-1.5 w-1.5 rounded-full" style="background:{SEV_DOT[e.level] ?? SEV_DOT.info};" aria-hidden="true"></span>
                {e.level === 'error' ? 'crit' : e.level}
              </span>
            </td>
            <td class="whitespace-nowrap px-2 py-1 text-[#6e7079]">{e.category ?? ''}</td>
            <td class="whitespace-nowrap px-2 py-1 text-[#6e7079] tabular-nums">{e.timestamp}</td>
            <td class="whitespace-nowrap px-2 py-1 text-[#c8c9d0]">{e.event}</td>
            <td class="whitespace-nowrap px-2 py-1 text-[#c8c9d0]">{e.subject ?? ''}</td>
            <td class="px-2 py-1 pr-3 text-text-3">{e.detail ?? ''}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>
