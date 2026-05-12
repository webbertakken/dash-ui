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
</script>

<div bind:this={root} role="radiogroup" aria-label={label} class="seg-ctrl" tabindex="-1" onkeydown={handleKeyDown}>
  {#each options as opt (opt.value)}
    <button
      type="button"
      role="radio"
      aria-checked={value === opt.value}
      disabled={opt.disabled}
      tabindex={value === opt.value ? 0 : -1}
      class="seg-ctrl__btn{value === opt.value ? ' seg-ctrl__btn--active' : ''}"
      onclick={() => { value = opt.value; }}
    >
      {opt.label}
    </button>
  {/each}
</div>
