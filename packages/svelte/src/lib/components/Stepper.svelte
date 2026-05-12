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
  

  let activeIdx = $derived(steps.findIndex(s => s.id === active));
</script>

<nav aria-label="Progress" class="stepper {className}">
  <ol class="stepper__list">
    {#each steps as step, idx}
      {@const isActive = step.id === active}
      {@const isDone = idx < activeIdx}
      {@const state = isActive ? 'active' : isDone ? 'done' : 'upcoming'}
      <li class="stepper__item stepper__item--{state}">
        <span class="stepper__num" aria-hidden="true">
          {#if isDone}
            <svg viewBox="0 0 12 12" width="12" height="12" fill="none">
              <path d="M2 6l3 3 5-5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          {:else}
            {idx + 1}
          {/if}
        </span>
        {#if isDone}<span class="sr-only">completed: </span>{/if}
        <span class="stepper__label" aria-current={isActive ? 'step' : undefined}>
          {step.label}
        </span>
      </li>
    {/each}
  </ol>
</nav>
