<script lang="ts">
  interface Props {
    class?: string;
    children?: import('svelte').Snippet;
  }

  let { class: className = '', children }: Props = $props();
</script>

<!--
  Uppercase, tracked overline used as a section eyebrow / category tag
  above a heading or beside a primary label. Renders
  <span class="dash-ui-eyebrow"> so the .dash-ui-eyebrow rule in
  @w5-ui/tokens/css applies the canonical 11 px / semibold weight,
  0.08em letter-spacing, uppercase text-transform and the muted
  --text-3 colour. Stops userland reaching for a one-off
  text-transform: uppercase + letter-spacing + font-size: 11px trio
  on every overline. Typed equivalent of
  <span class="dash-ui-eyebrow"> (the contrast pair is AA against
  every motif background, verified for --text-3 over
  --depthBg-0/--depthBg-1/--depthBg-2 in both dark and light motifs).
-->
<span class="dash-ui-eyebrow {className}">
  {@render children?.()}
</span>
