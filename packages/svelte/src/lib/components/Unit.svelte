<script lang="ts">
  interface Props {
    class?: string;
    children?: import('svelte').Snippet;
  }

  let { class: className = '', children }: Props = $props();
</script>

<!--
  Small inline label that trails a hero number inside a .stat row or a <Card>
  title row (e.g. "Mbps · down", "Last 24 h", "ms · jitter band"). Renders a
  <span class="unit"> so the .unit rule in @w5-ui/tokens/dashboard.css sets
  the canonical muted colour, 12 px size, and inline-block rhythm. Stops
  userland reaching for inline font-size / color overrides next to bare
  numbers. Pair with <Stat> (which already wires this internally) for hero
  tiles, or compose by hand inside a <Card> when the number sits above a
  chart.
-->
<span class="unit {className}">
  {@render children?.()}
</span>
