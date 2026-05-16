<script lang="ts">
  interface Props {
    class?: string;
    children?: import('svelte').Snippet;
  }

  let { class: className = '', children }: Props = $props();
</script>

<!--
  Sub-section heading - the 24 px / semibold / --lh-snug rhythm used
  for sub-section labels on a dashboard page (a heading inside a card
  region, a settings sub-group, a divider above a secondary table).
  Renders <h3 class="dash-ui-h3"> so the .dash-ui-h3 rule in
  @w5-ui/tokens/tokens.css pins the canonical size, weight, line-height,
  and --text-1 colour. Stops userland reaching for a one-off
  <h3 style="font-size: 24px; font-weight: 600"> (or worse, leaving an
  unstyled browser default <h3> at ~18.7 px with 700 weight and 1.2
  line-height, which is the documented "sub-section headings drift away
  from the reference" case). Typed equivalent of
  <h3 class="dash-ui-h3"> (the userland-facing semantic class
  documented in Foundations / Type). Use <H3> for a sub-section head
  sitting below an <H2> page section head. For card titles prefer <H4>
  (or just <Card title="..."> which injects .dash-ui-h4 for you); for
  page section heads prefer <H2>.
-->
<h3 class="dash-ui-h3 {className}">
  {@render children?.()}
</h3>
