<script lang="ts">
  interface Props {
    class?: string;
    children?: import('svelte').Snippet;
  }

  let { class: className = '', children }: Props = $props();
</script>

<!--
  Inline monospace label for MAC addresses, IPs, SKUs, serial numbers and
  other fixed-width identifiers that read inside a table cell or a property
  row. Renders a <span class="mac"> so the .mac rule in
  @w5-ui/tokens/dashboard.css applies the canonical JetBrains Mono family,
  12 px size, and muted colour. Stops userland reaching for inline
  font-family / font-size overrides on bare identifiers. Typed equivalent of
  <span class="mac"> (apply the class directly to a <td> when the entire
  cell is the identifier, or wrap the cell contents with <Mac> when the cell
  carries other markup too).
-->
<span class="mac {className}">
  {@render children?.()}
</span>
