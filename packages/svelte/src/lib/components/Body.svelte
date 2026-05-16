<script lang="ts">
  interface Props {
    class?: string;
    children?: import('svelte').Snippet;
  }

  let { class: className = '', children }: Props = $props();
</script>

<!--
  Default body paragraph - the 14 px / regular / 1.4 / --text-2 rhythm
  that runs across table cells, paragraphs, and most user-readable copy
  in the dashboard. Renders <p class="dash-ui-body"> so the
  .dash-ui-body rule in @w5-ui/tokens/tokens.css pins the canonical
  size, weight, line-height, and colour. Stops userland reaching for a
  one-off font-size: 14px; line-height: 1.4; duo (or worse, leaving the
  16 px browser default in place and getting the #1 documented spacing
  drift: "page text looks too big vs the reference dashboard"). Typed
  equivalent of <p class="dash-ui-body"> (the userland-facing semantic
  class documented in Foundations / Type). Body copy is "almost always
  inherited, almost never overridden" inside .card / .table-shell /
  page chrome - reach for <Body> when wrapping standalone prose in
  userland (empty states, onboarding paragraphs, info banners) or when
  a parent stylesheet has reset the default size and you need to opt
  back in explicitly. For 16 px settings descriptions prefer <BodyLg>.
-->
<p class="dash-ui-body {className}">
  {@render children?.()}
</p>
