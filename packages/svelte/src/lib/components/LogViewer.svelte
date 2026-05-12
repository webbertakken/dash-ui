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

  // Replaces `afterUpdate`: `$effect` runs after every DOM commit triggered
  // by reactive dependencies. Reading `entries` ensures we re-scroll on
  // every new batch.
  $effect(() => {
    void entries.length;
    if (follow && bodyEl) bodyEl.scrollTop = bodyEl.scrollHeight;
  });
</script>

<div class="lv {className}">
  <div class="lv__toolbar">
    <span class="lv__count">{entries.length} entries</span>
    <button
      type="button"
      class="lv__follow{follow ? ' lv__follow--on' : ''}"
      onclick={() => { follow = !follow; }}
      aria-pressed={follow}
    >Follow</button>
  </div>
  <div
    bind:this={bodyEl}
    role="log"
    aria-live="polite"
    aria-label={ariaLabel}
    class="lv__body"
    style="height:{height}px;"
  >
    <table class="lv__table">
      <caption class="sr-only">{ariaLabel}</caption>
      <thead>
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
          <tr>
            <td>
              <span class="lv__sev lv__sev--{e.level}">
                <span class="lv__dot" style="background:{SEV_DOT[e.level] ?? SEV_DOT.info};" aria-hidden="true"></span>
                {e.level === 'error' ? 'crit' : e.level}
              </span>
            </td>
            <td class="lv__cat">{e.category ?? ''}</td>
            <td class="lv__time">{e.timestamp}</td>
            <td class="lv__event">{e.event}</td>
            <td class="lv__subject">{e.subject ?? ''}</td>
            <td class="lv__detail">{e.detail ?? ''}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>
