<script lang="ts">
  interface Props {
    href?: string;
    class?: string;
    children?: import('svelte').Snippet;
  }

  let { href = undefined, class: className = '', children }: Props = $props();
</script>

<!--
  Trailing "View all" / "More →" affordance inside a <Card> title row. Renders
  an <a class="more"> so the `.card h3 .more` rule in
  @w5-ui/tokens/dashboard.css styles it (muted colour, pointer cursor) and the
  parent <h3> flex pushes it to the right edge of the title. Pair with <Card>
  and a plain <h3> for the canonical card title pattern.
-->
<a {href} class="more {className}">
  {@render children?.()}
</a>
