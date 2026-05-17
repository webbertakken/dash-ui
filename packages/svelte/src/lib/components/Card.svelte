<script lang="ts">
  interface Props {
    span?: number | undefined;
    class?: string;
    style?: string;
    children?: import('svelte').Snippet;
  }

  let {
    span = undefined,
    class: className = '',
    style = '',
    children,
  }: Props = $props();
  let spanStyle = $derived(span !== undefined ? `grid-column: span ${span};` : '');
</script>

<!--
  Motif-aware card surface: bg via `var(--depthBg-1)` (= `#141415` dark,
  `#ffffff` light) and border via `var(--border-1)`. The `h3` child
  styling lives in the consumer slot — Tailwind utilities at the call
  site, not bundled here.
-->
<div
  class="flex min-w-0 flex-col gap-2 rounded-[8px] border border-border-1 bg-bg-1 px-4 py-3.5 {className}"
  style="{spanStyle} {style}"
>
  {@render children?.()}
</div>
