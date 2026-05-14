<script module lang="ts">
  export interface TimelineEvent {
    id: string;
    title: string;
    description?: string;
    time: string;
    variant?: 'info' | 'warn' | 'danger' | 'success' | 'neutral';
  }
</script>

<script lang="ts">
  interface Props {
    events: TimelineEvent[];
    class?: string;
  }

  let { events, class: className = '' }: Props = $props();

  type V = NonNullable<TimelineEvent['variant']>;
  const VARIANT: Record<V, string> = {
    info: 'bg-brand-05',
    success: 'bg-status-success',
    warn: 'bg-status-warning',
    danger: 'bg-status-danger',
    neutral: 'bg-white/30',
  };
</script>

<ol class="relative m-0 list-none p-0 {className}" aria-label="Event timeline">
  {#each events as e (e.id)}
    <li class="relative flex gap-3 pb-3 pl-4 last:pb-0 [&:not(:last-child)]:before:absolute [&:not(:last-child)]:before:bottom-0 [&:not(:last-child)]:before:left-[5px] [&:not(:last-child)]:before:top-4 [&:not(:last-child)]:before:w-px [&:not(:last-child)]:before:bg-white/[0.08] [&:not(:last-child)]:before:content-['']">
      <span
        class="absolute left-0 top-1.5 inline-block h-2.5 w-2.5 shrink-0 rounded-full {VARIANT[e.variant ?? 'neutral']}"
        aria-hidden="true"
      ></span>
      <div class="min-w-0 flex-1">
        <div class="flex items-baseline justify-between gap-2">
          <span class="font-medium text-white">{e.title}</span>
          <time class="shrink-0 text-11 text-[#6e7079] tabular-nums">{e.time}</time>
        </div>
        {#if e.description}
          <p class="m-0 mt-0.5 text-12 text-text-3">{e.description}</p>
        {/if}
      </div>
    </li>
  {/each}
</ol>
