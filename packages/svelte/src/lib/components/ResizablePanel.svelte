<script context="module" lang="ts">
  export type ResizableOrientation = 'horizontal' | 'vertical';
</script>

<script lang="ts">
  export let defaultSize: number = 50;
  export let min: number = 20;
  export let max: number = 80;
  export let orientation: ResizableOrientation = 'vertical';
  export let label: string = 'Resize panels';
  export let style: string = '';

  let size = defaultSize;
  let container: HTMLDivElement;

  function clamp(v: number) { return Math.min(max, Math.max(min, v)); }

  function onMouseDown(e: MouseEvent) {
    e.preventDefault();

    function onMove(me: MouseEvent) {
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const pct = orientation === 'vertical'
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

  $: firstStyle = orientation === 'vertical'
    ? `flex: 0 0 ${size}%; min-width: 0;`
    : `flex: 0 0 ${size}%; min-height: 0;`;
</script>

<div bind:this={container} class="rp rp--{orientation}" {style}>
  <div class="rp-pane" style={firstStyle}>
    <slot name="first" />
  </div>
  <!-- svelte-ignore a11y-no-noninteractive-tabindex a11y-no-noninteractive-element-interactions -->
  <div
    role="separator"
    tabindex="0"
    aria-orientation={orientation}
    aria-valuenow={size}
    aria-valuemin={min}
    aria-valuemax={max}
    aria-label={label}
    class="rp-handle"
    on:mousedown={onMouseDown}
    on:keydown={onKeyDown}
  />
  <div class="rp-pane rp-pane--second">
    <slot name="second" />
  </div>
</div>
