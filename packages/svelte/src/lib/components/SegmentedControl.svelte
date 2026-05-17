<script module lang="ts">
  export interface SegmentOption {
    value: string;
    label: string;
    disabled?: boolean;
  }
</script>

<script lang="ts">
  import { tick } from 'svelte';

  interface Props {
    label: string;
    options?: SegmentOption[];
    value?: string;
  }

  let { label, options = [], value = $bindable(options[0]?.value ?? '') }: Props = $props();

  let root = $state<HTMLDivElement | undefined>(undefined);

  async function handleKeyDown(e: KeyboardEvent) {
    const enabled = options.filter((o) => !o.disabled);
    const idx = enabled.findIndex((o) => o.value === value);
    let next = -1;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      next = (idx + 1) % enabled.length;
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      next = (idx - 1 + enabled.length) % enabled.length;
    }
    if (next !== -1) {
      value = enabled[next].value;
      await tick();
      root?.querySelector<HTMLButtonElement>('button[tabindex="0"]')?.focus();
    }
  }

  const BTN_BASE =
    'flex-shrink-0 grow-0 inline-flex h-7 cursor-pointer select-none items-center justify-center whitespace-nowrap rounded-md border-0 bg-transparent px-3 text-12 font-medium leading-none text-text-3 transition-[background-color,color] duration-100 hover:bg-row-hover hover:text-text-1 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-brand-05';
  // Active button uses the elevated `--depthBg-3` so the active pill
  // is legible on both motifs (a darker step on dark, a softer grey on light).
  const BTN_ACTIVE =
    'bg-bg-3 text-text-1 shadow-[0_1px_3px_rgba(0,0,0,0.18)] dark:shadow-[0_1px_3px_rgba(0,0,0,0.4)]';
</script>

<div
  bind:this={root}
  role="radiogroup"
  aria-label={label}
  class="inline-flex gap-px rounded-lg bg-bg-2 p-0.5"
  tabindex={-1}
  onkeydown={handleKeyDown}
>
  {#each options as opt (opt.value)}
    <button
      type="button"
      role="radio"
      aria-checked={value === opt.value}
      disabled={opt.disabled}
      tabindex={value === opt.value ? 0 : -1}
      class="{BTN_BASE} {value === opt.value ? BTN_ACTIVE : ''}"
      onclick={() => { value = opt.value; }}
    >
      {opt.label}
    </button>
  {/each}
</div>
