<script lang="ts">
  interface Props {
    class?: string;
    children?: import('svelte').Snippet;
  }

  let { class: className = '', children }: Props = $props();
</script>

<!--
  The canonical 12-column page grid (repeat(12, 1fr), 12px gap, 16px 24px
  padding, reserves room for the bottom panel). Typed equivalent of
  `<div class="grid">` from @w5-ui/tokens/dashboard.css.
-->
<div class="grid {className}">
  {@render children?.()}
</div>
