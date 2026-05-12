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
    content
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
</script>

<div
  role="group"
  class="hovercard-wrapper hovercard-{placement} {className}"
  onmouseenter={show}
  onmouseleave={hide}
  onfocusin={show}
  onfocusout={hide}
>
  <div class="hovercard-trigger" aria-describedby={open ? id : undefined}>
    {@render trigger?.()}
  </div>
  {#if open}
    <div {id} role="tooltip" class="hovercard">
      {@render content?.()}
    </div>
  {/if}
</div>
