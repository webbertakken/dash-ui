<script lang="ts">
  interface Props {
    class?: string;
    children?: import('svelte').Snippet;
  }

  let { class: className = '', children }: Props = $props();
</script>

<!--
  Hero-number row inside a <Card>: the big tabular-nums value (optionally
  followed by a trailing <Unit>). Renders a <div class="stat"> so the .stat
  rule in @w5-ui/tokens/dashboard.css sets the canonical 30 px size, semibold
  weight, tabular figures, and primary text colour. Stops userland reaching
  for inline font-size / font-weight overrides on bare numbers. Pair with
  <Unit> for the suffix label and <Submeta> for the muted line underneath;
  <Stat> already wires all three internally, so reach for <StatNumber> when
  you compose .stat by hand (e.g. number above a chart inside a <Card>).
-->
<div class="stat {className}">
  {@render children?.()}
</div>
