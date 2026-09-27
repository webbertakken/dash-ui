<script module lang="ts">
  let counter = 0;
</script>

<!--
  Tooltip: the NAME of a control, never its only carrier of meaning.
  Opens after 1 s of hover, instantly on keyboard focus, and on touch
  long-press; dismissible with Escape and hoverable (WCAG 1.4.13).
  Rich content belongs in a HoverCard; click-opened surfaces in a Popover.
-->
<script lang="ts">
  import { onDestroy } from 'svelte';
  import { createOverlayTrigger, ensureAccessibleName, overlay } from '@w5-ui/tokens';
  import { listenForEscape, overlayHandlers } from './overlay-trigger.ts';

  interface Props {
    /** The control's name: short plain text. An icon-only control is named after it. */
    label: string;
    placement?: 'top' | 'bottom' | 'left' | 'right';
    /** Hover delay in ms; defaults to `overlay.tooltipOpenDelayMs` (1 s). Keyboard focus is always instant. */
    delay?: number | undefined;
    class?: string;
    children?: import('svelte').Snippet;
  }

  let {
    label,
    placement = 'top',
    delay = undefined,
    class: className = '',
    children,
  }: Props = $props();

  const id = `dash-ui-tooltip-${++counter}`;
  let open = $state(false);
  let triggerEl = $state<HTMLSpanElement | undefined>(undefined);

  const trigger = createOverlayTrigger({
    openDelayMs: overlay.tooltipOpenDelayMs,
    closeOnPress: true,
    longPressMs: overlay.longPressMs,
    onOpenChange: (next) => (open = next),
  });
  const handlers = overlayHandlers(trigger);

  $effect(() => {
    trigger.setOpenDelay(delay ?? overlay.tooltipOpenDelayMs);
  });
  $effect(() => {
    ensureAccessibleName(triggerEl, label);
  });
  $effect(() => {
    if (!open) return;
    return listenForEscape(trigger);
  });
  onDestroy(() => trigger.destroy());

  // Pre-composed placement strings so Tailwind's scanner picks each up.
  const PLACEMENT: Record<NonNullable<Props['placement']>, string> = {
    top: 'bottom-[calc(100%+6px)] left-1/2 -translate-x-1/2',
    bottom: 'top-[calc(100%+6px)] left-1/2 -translate-x-1/2',
    left: 'right-[calc(100%+6px)] top-1/2 -translate-y-1/2',
    right: 'left-[calc(100%+6px)] top-1/2 -translate-y-1/2',
  };
</script>

<span
  role="presentation"
  class="relative inline-flex {className}"
  data-state={open ? 'open' : 'closed'}
  data-placement={placement}
  {...handlers}
>
  <span bind:this={triggerEl} class="inline-flex">{@render children?.()}</span>
  <span
    {id}
    role="tooltip"
    class="absolute z-[9999] whitespace-nowrap rounded border border-border-2 bg-bg-2 px-2 py-1 text-[11px] leading-[1.3] text-text-1 transition-[opacity,visibility] duration-150 ease-out motion-reduce:transition-none
      {open ? 'pointer-events-auto visible opacity-100' : 'pointer-events-none invisible opacity-0'}
      {PLACEMENT[placement]}"
  >{label}</span>
</span>
