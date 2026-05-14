<script module lang="ts">
  let counter = 0;
</script>

<script lang="ts">
  import { onDestroy } from 'svelte';

  interface Props {
    placement?: 'top' | 'bottom' | 'left' | 'right';
    delay?: number;
    class?: string;
    trigger?: import('svelte').Snippet;
    content?: import('svelte').Snippet;
  }

  let {
    placement = 'bottom',
    delay = 300,
    class: className = '',
    trigger,
    content,
  }: Props = $props();

  const id = `dash-ui-hovercard-${++counter}`;
  let open = $state(false);
  let timer: ReturnType<typeof setTimeout> | null = null;

  function show() {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => { open = true; }, delay);
  }

  function hide() {
    if (timer) clearTimeout(timer);
    open = false;
  }

  onDestroy(() => { if (timer) clearTimeout(timer); });

  const PLACEMENT: Record<NonNullable<Props['placement']>, string> = {
    top: 'bottom-[calc(100%+6px)] left-0',
    bottom: 'top-[calc(100%+6px)] left-0',
    left: 'right-[calc(100%+6px)] top-0',
    right: 'left-[calc(100%+6px)] top-0',
  };
</script>

<div
  role="group"
  class="relative block {className}"
  onmouseenter={show}
  onmouseleave={hide}
  onfocusin={show}
  onfocusout={hide}
>
  <div class="block" aria-describedby={open ? id : undefined}>
    {@render trigger?.()}
  </div>
  {#if open}
    <div
      {id}
      role="tooltip"
      class="absolute z-[9998] min-w-[200px] max-w-[280px] rounded-[10px] border border-white/[0.12] bg-[#1a1a1c] p-3 text-12 shadow-[0_8px_32px_rgba(0,0,0,0.5)] {PLACEMENT[placement]}"
    >
      {@render content?.()}
    </div>
  {/if}
</div>
