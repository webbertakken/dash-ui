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
  Card chrome stays motif-blind (matches dashboard.css: bg #141415,
  border rgba(255,255,255,0.06)). The `h3` child styling lives in the
  consumer slot — Tailwind utilities at the call site, not bundled here.
-->
<div
  class="flex min-w-0 flex-col gap-2 rounded-[8px] border border-white/[0.06] bg-neutral-09 px-4 py-3.5 {className}"
  style="{spanStyle} {style}"
>
  {@render children?.()}
</div>
