<script lang="ts">
  interface Props {
    class?: string;
    children?: import('svelte').Snippet;
  }

  let { class: className = '', children }: Props = $props();
</script>

<!--
  Card / tile title - the 18 px / semibold / --lh-snug rhythm used for
  the heading that sits inside a card, a stat tile, or a settings
  sub-panel. Renders <h4 class="dash-ui-h4"> so the .dash-ui-h4 rule in
  @w5-ui/tokens/tokens.css pins the canonical size, weight, line-height,
  and --text-1 colour. Stops userland reaching for a one-off
  <h3 style="font-size: 20px"> or text-xl (the documented "card title
  size doesn't match the reference" case), and stops them leaving an
  unstyled browser default <h4> at ~13.3 px / 700 / 1.2 which reads as
  caption text instead of a title. Typed equivalent of
  <h4 class="dash-ui-h4"> (the userland-facing semantic class documented
  in Foundations / Type). Use <H4> when you build a card-like tile by
  hand and need the canonical 18 / 600 title. If you reach for
  <Card title="..."> you get the same class injected for you - prefer
  that. For page section heads prefer <H2>; for sub-section heads
  prefer <H3>.
-->
<h4 class="dash-ui-h4 {className}">
  {@render children?.()}
</h4>
