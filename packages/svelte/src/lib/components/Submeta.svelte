<script lang="ts">
  interface Props {
    class?: string;
    children?: import('svelte').Snippet;
  }

  let { class: className = '', children }: Props = $props();
</script>

<!--
  Secondary one-line caption inside a <Card> tile: the muted row that sits
  under the headline .stat number and carries supporting metrics, deltas, or
  status. Typed equivalent of `<div class="submeta">` from
  @w5-ui/tokens/dashboard.css. Pair with `.delta-up` / `.delta-down` spans
  for trend text so screen readers announce the direction.
-->
<div class="submeta {className}">
  {@render children?.()}
</div>
