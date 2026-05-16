<script lang="ts">
  interface Props {
    class?: string;
    children?: import('svelte').Snippet;
  }

  let { class: className = '', children }: Props = $props();
</script>

<!--
  Inline monospace identifier for MAC addresses, IPs, hex IDs, ports,
  firmware versions, config keys, and other machine-shaped values that
  read inside body copy or a property row. Renders a
  <span class="dash-ui-mono"> so the .dash-ui-mono rule in
  @w5-ui/tokens/tokens.css applies the canonical JetBrains Mono family,
  13 px size, regular weight, 1.4 line-height, and --text-2 colour. The
  class also enables font-variant-numeric: tabular-nums so a column of
  MACs / IPs / versions aligns vertically. Stops userland reaching for
  bare font-family: monospace (which falls back to a serif Courier with
  proportional digits) or one-off font-size overrides on identifiers.
  Typed equivalent of <span class="dash-ui-mono"> (the userland-facing
  semantic class documented in Foundations / Type). Prefer <Mono> for
  new userland code; reach for <Mac> only when you need the dashboard's
  denser 12 px .mac variant (reference Devices / Clients table cells).
-->
<span class="dash-ui-mono {className}">
  {@render children?.()}
</span>
