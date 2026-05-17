<script module lang="ts">
  export type ResizableOrientation = 'horizontal' | 'vertical';
</script>

<script lang="ts">
  interface Props {
    defaultSize?: number;
    min?: number;
    max?: number;
    orientation?: ResizableOrientation;
    label?: string;
    style?: string;
    first?: import('svelte').Snippet;
    second?: import('svelte').Snippet;
  }

  let {
    defaultSize = 50,
    min = 20,
    max = 80,
    orientation = 'vertical',
    label = 'Resize panels',
    style = '',
    first,
    second,
  }: Props = $props();

  // svelte-ignore state_referenced_locally
  let size = $state(defaultSize);
  let container = $state<HTMLDivElement | undefined>(undefined);

  function clamp(v: number) {
    return Math.min(max, Math.max(min, v));
  }

  function onMouseDown(e: MouseEvent) {
    e.preventDefault();

    function onMove(me: MouseEvent) {
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const pct =
        orientation === 'vertical'
          ? ((me.clientX - rect.left) / rect.width) * 100
          : ((me.clientY - rect.top) / rect.height) * 100;
      size = clamp(Math.round(pct));
    }

    function onUp() {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    }

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  }

  function onKeyDown(e: KeyboardEvent) {
    const step = e.shiftKey ? 10 : 1;
    if (orientation === 'vertical') {
      if (e.key === 'ArrowLeft') { e.preventDefault(); size = clamp(size - step); }
      if (e.key === 'ArrowRight') { e.preventDefault(); size = clamp(size + step); }
    } else {
      if (e.key === 'ArrowUp') { e.preventDefault(); size = clamp(size - step); }
      if (e.key === 'ArrowDown') { e.preventDefault(); size = clamp(size + step); }
    }
    if (e.key === 'Home') { e.preventDefault(); size = min; }
    if (e.key === 'End') { e.preventDefault(); size = max; }
  }

  let firstStyle = $derived(
    orientation === 'vertical'
      ? `flex: 0 0 ${size}%; min-width: 0;`
      : `flex: 0 0 ${size}%; min-height: 0;`,
  );
</script>

<div
  bind:this={container}
  data-orientation={orientation}
  class="flex h-full w-full overflow-hidden data-[orientation=horizontal]:flex-col"
  {style}
>
  <div class="overflow-hidden" style={firstStyle}>
    {@render first?.()}
  </div>
  <!-- svelte-ignore a11y_no_noninteractive_tabindex, a11y_no_noninteractive_element_interactions -->
  <div
    role="separator"
    tabindex={0}
    aria-orientation={orientation}
    aria-valuenow={size}
    aria-valuemin={min}
    aria-valuemax={max}
    aria-label={label}
    data-orientation={orientation}
    class="shrink-0 cursor-col-resize bg-row-active hover:bg-brand-05/40 data-[orientation=horizontal]:cursor-row-resize data-[orientation=vertical]:w-1 data-[orientation=horizontal]:h-1 focus-visible:bg-brand-05 focus-visible:outline-none"
    onmousedown={onMouseDown}
    onkeydown={onKeyDown}
  ></div>
  <div class="min-w-0 flex-1 overflow-hidden">
    {@render second?.()}
  </div>
</div>
