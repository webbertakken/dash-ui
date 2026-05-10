<script context="module" lang="ts">
  let counter = 0;
</script>

<script lang="ts">
  import { onDestroy } from 'svelte';
  export let placement: 'top' | 'bottom' | 'left' | 'right' = 'bottom';
  export let delay: number = 300;
  let className = '';
  export { className as class };

  const id = `dash-ui-hovercard-${++counter}`;
  let open = false;
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
</script>

<div
  role="group"
  class="hovercard-wrapper hovercard-{placement} {className}"
  on:mouseenter={show}
  on:mouseleave={hide}
  on:focusin={show}
  on:focusout={hide}
>
  <div class="hovercard-trigger" aria-describedby={open ? id : undefined}>
    <slot name="trigger" />
  </div>
  {#if open}
    <div {id} role="tooltip" class="hovercard">
      <slot name="content" />
    </div>
  {/if}
</div>
