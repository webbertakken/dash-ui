<script context="module" lang="ts">
  let counter = 0;
</script>

<script lang="ts">
  import { onMount, onDestroy, tick } from 'svelte';

  export let title: string;
  export let body: string;
  export let placement: 'top' | 'bottom' = 'top';

  const uid = `dash-ui-ch-${++counter}`;
  const titleId = `${uid}-title`;

  let open = false;
  let rootEl: HTMLSpanElement;
  let triggerEl: HTMLButtonElement;
  let panelEl: HTMLDivElement;

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
    on:click={toggle}
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
