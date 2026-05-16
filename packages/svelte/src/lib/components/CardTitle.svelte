<script lang="ts">
  interface Props {
    class?: string;
    children?: import('svelte').Snippet;
  }

  let { class: className = '', children }: Props = $props();
</script>

<!--
  Title row inside a <Card> tile. Renders a plain <h3> so the `.card h3` rule
  in @w5-ui/tokens/dashboard.css sets the canonical 12 px size, weight 500,
  --text-muted colour, and flex layout (title on the left, any trailing
  <Pill> / <CardMore> pushed to the right edge). Stops userland reaching for
  an <h2> or a custom <div class="title"> that would skip the rule and read
  broken inside the tile. Pair with <CardMore> for a "View all →" affordance.
-->
<h3 class={className}>
  {@render children?.()}
</h3>
