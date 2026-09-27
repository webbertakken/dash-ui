<script module lang="ts">
  let counter = 0;
</script>

<!--
  Hover card: rich, non-essential content about its trigger. Opens
  instantly on hover and keyboard focus; dismissible with Escape and
  hoverable (WCAG 1.4.13). A control's name belongs in a Tooltip;
  interactive surfaces in a Popover.
-->
<script lang="ts">
  import { onDestroy } from 'svelte';
  import { createOverlayTrigger, overlay } from '@w5-ui/tokens';
  import { listenForEscape, overlayHandlers } from './overlay-trigger.ts';

  interface Props {
    /** Bold title line. */
    heading?: string | undefined;
    /** Supporting text under the heading. */
    description?: string | undefined;
    placement?: 'top' | 'bottom' | 'left' | 'right';
    /** Hover delay in ms; defaults to `overlay.hoverCardOpenDelayMs` (instant). */
    delay?: number | undefined;
    class?: string;
    /** The trigger. `children` is the same slot, for Web Components and plain markup. */
    trigger?: import('svelte').Snippet;
    children?: import('svelte').Snippet;
    /** Rich content (preview, key/value rows), rendered after heading and description. */
    content?: import('svelte').Snippet;
  }

  let {
    heading = undefined,
    description = undefined,
    placement = 'bottom',
    delay = undefined,
    class: className = '',
    trigger: triggerSnippet,
    children,
    content,
  }: Props = $props();

  const id = `dash-ui-hovercard-${++counter}`;
  let open = $state(false);

  const trigger = createOverlayTrigger({
    openDelayMs: overlay.hoverCardOpenDelayMs,
    closeOnPress: false,
    longPressMs: null,
    onOpenChange: (next) => (open = next),
  });
  const handlers = overlayHandlers(trigger);

  $effect(() => {
    trigger.setOpenDelay(delay ?? overlay.hoverCardOpenDelayMs);
  });
  $effect(() => {
    if (!open) return;
    return listenForEscape(trigger);
  });
  onDestroy(() => trigger.destroy());

  const PLACEMENT: Record<NonNullable<Props['placement']>, string> = {
    top: 'bottom-[calc(100%+6px)] left-0',
    bottom: 'top-[calc(100%+6px)] left-0',
    left: 'right-[calc(100%+6px)] top-0',
    right: 'left-[calc(100%+6px)] top-0',
  };
</script>

<div
  role="presentation"
  class="relative block {className}"
  data-state={open ? 'open' : 'closed'}
  data-placement={placement}
  {...handlers}
>
  <div class="block" aria-describedby={open ? id : undefined}>
    {#if triggerSnippet}{@render triggerSnippet()}{:else}{@render children?.()}{/if}
  </div>
  <div
    {id}
    data-hovercard
    class="absolute z-[9998] min-w-[200px] max-w-[280px] rounded-[10px] border border-border-3 bg-bg-2 p-3 text-12 text-text-2 shadow-[0_8px_32px_rgba(0,0,0,0.5)] transition-[opacity,visibility] duration-150 ease-out motion-reduce:transition-none
      {open ? 'pointer-events-auto visible opacity-100' : 'pointer-events-none invisible opacity-0'}
      {PLACEMENT[placement]}"
  >
    {#if heading}
      <p data-hovercard-title class="m-0 mb-2 text-13 font-semibold leading-[1.3] text-text-1">{heading}</p>
    {/if}
    {#if description}
      <p data-hovercard-description class="m-0 leading-[1.4] text-text-2 [&:not(:last-child)]:mb-2">{description}</p>
    {/if}
    {@render content?.()}
  </div>
</div>
