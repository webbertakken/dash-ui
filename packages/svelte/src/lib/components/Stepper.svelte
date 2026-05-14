<script module lang="ts">
  export interface StepperStep {
    id: string;
    label: string;
  }
</script>

<script lang="ts">
  interface Props {
    steps: StepperStep[];
    active: string;
    class?: string;
  }

  let { steps, active, class: className = '' }: Props = $props();
  let activeIdx = $derived(steps.findIndex((s) => s.id === active));

  // Per-state ramp:
  //   - num circle: ring + bg + text colour
  //   - label: colour + weight
  //   - connector line (::before via Tailwind arbitrary): bg colour
  const NUM: Record<'active' | 'done' | 'upcoming', string> = {
    active: 'border-brand-05 bg-brand-05 text-white',
    done: 'border-brand-05 bg-brand-05/[0.18] text-[#7fb6ff]',
    upcoming: 'border-[#2a2a2c] bg-neutral-09 text-[#6e7079]',
  };
  const LABEL: Record<'active' | 'done' | 'upcoming', string> = {
    active: 'text-white font-medium',
    done: 'text-[#7fb6ff]',
    upcoming: 'text-[#6e7079]',
  };
  // Connector tail to the left, drawn from item to item.
  const TAIL: Record<'active' | 'done' | 'upcoming', string> = {
    active: 'before:bg-brand-05',
    done: 'before:bg-brand-05',
    upcoming: 'before:bg-[#2a2a2c]',
  };
</script>

<nav aria-label="Progress" class="w-full {className}">
  <ol class="m-0 flex list-none items-start p-0">
    {#each steps as step, idx}
      {@const isActive = step.id === active}
      {@const isDone = idx < activeIdx}
      {@const state = (isActive ? 'active' : isDone ? 'done' : 'upcoming') as 'active' | 'done' | 'upcoming'}
      <li class="relative flex flex-1 flex-col items-center gap-1.5 [&:not(:first-child)]:before:absolute [&:not(:first-child)]:before:left-[-50%] [&:not(:first-child)]:before:right-1/2 [&:not(:first-child)]:before:top-[13px] [&:not(:first-child)]:before:h-px [&:not(:first-child)]:before:content-[''] {TAIL[state]}">
        <span
          class="relative z-10 flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-full border-[1.5px] text-11 font-semibold {NUM[state]}"
          aria-hidden="true"
        >
          {#if isDone}
            <svg viewBox="0 0 12 12" width="12" height="12" fill="none">
              <path d="M2 6l3 3 5-5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          {:else}
            {idx + 1}
          {/if}
        </span>
        {#if isDone}<span class="sr-only">completed: </span>{/if}
        <span class="text-center text-11 leading-[1.3] {LABEL[state]}" aria-current={isActive ? 'step' : undefined}>
          {step.label}
        </span>
      </li>
    {/each}
  </ol>
</nav>
