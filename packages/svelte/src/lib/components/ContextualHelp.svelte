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
</script>

<span class="ch-root" bind:this={rootEl}>
  <button
    bind:this={triggerEl}
    type="button"
    class="ch-trigger"
    aria-label="Help"
    aria-haspopup="dialog"
    aria-expanded={open}
    onclick={toggle}
  >?</button>
  {#if open}
    <div
      bind:this={panelEl}
      role="dialog"
      aria-labelledby={titleId}
      class="ch-panel ch-panel--{placement}"
      tabindex="-1"
    >
      <div id={titleId} class="ch-title">{title}</div>
      <div class="ch-body">{body}</div>
    </div>
  {/if}
</span>
