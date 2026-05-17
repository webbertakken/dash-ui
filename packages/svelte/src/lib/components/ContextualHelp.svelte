<script module lang="ts">
  let counter = 0;
</script>

<script lang="ts">
  import { onMount, onDestroy, tick } from 'svelte';

  interface Props {
    title: string;
    body: string;
    placement?: 'top' | 'bottom';
  }

  let { title, body, placement = 'top' }: Props = $props();

  const uid = `dash-ui-ch-${++counter}`;
  const titleId = `${uid}-title`;

  let open = $state(false);
  let rootEl = $state<HTMLSpanElement | undefined>(undefined);
  let triggerEl = $state<HTMLButtonElement | undefined>(undefined);
  let panelEl = $state<HTMLDivElement | undefined>(undefined);

  async function toggle() {
    open = !open;
    if (open) {
      await tick();
      panelEl?.focus();
    }
  }

  function onKey(e: KeyboardEvent) {
    if (!open) return;
    if (e.key === 'Escape') {
      e.preventDefault();
      open = false;
      triggerEl?.focus();
    }
  }

  function onPointer(e: PointerEvent) {
    if (open && !rootEl?.contains(e.target as Node)) open = false;
  }

  onMount(() => {
    window.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onPointer);
  });
  onDestroy(() => {
    window.removeEventListener('keydown', onKey);
    document.removeEventListener('pointerdown', onPointer);
  });

  const PLACEMENT: Record<NonNullable<Props['placement']>, string> = {
    top: 'bottom-[calc(100%+8px)] left-1/2 -translate-x-1/2',
    bottom: 'top-[calc(100%+8px)] left-1/2 -translate-x-1/2',
  };
</script>

<span class="relative inline-flex items-center" bind:this={rootEl}>
  <button
    bind:this={triggerEl}
    type="button"
    aria-label="Help"
    aria-haspopup="dialog"
    aria-expanded={open}
    class="inline-flex h-4 w-4 shrink-0 cursor-pointer items-center justify-center rounded-full border border-border-3 bg-transparent p-0 text-[10px] font-bold leading-none text-text-4 transition-[border-color,color] duration-100 hover:border-text-3 hover:text-text-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-05"
    onclick={toggle}
  >?</button>
  {#if open}
    <div
      bind:this={panelEl}
      role="dialog"
      aria-labelledby={titleId}
      class="absolute z-[9200] min-w-[220px] max-w-[300px] rounded-[10px] border border-border-3 bg-bg-2 shadow-[0_8px_32px_rgba(0,0,0,0.5)] focus:outline-none {PLACEMENT[placement]}"
      tabindex={-1}
    >
      <div id={titleId} class="border-b border-border-1 px-3.5 pb-2 pt-2.5 text-12 font-semibold text-text-2">{title}</div>
      <div class="px-3.5 py-2.5 text-12 leading-[1.5] text-text-3">{body}</div>
    </div>
  {/if}
</span>
