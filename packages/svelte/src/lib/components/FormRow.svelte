<script lang="ts">
  interface Props {
    class?: string;
    children?: import('svelte').Snippet;
  }

  let { class: className = '', children }: Props = $props();
</script>

<!--
  Two-column form grid (1fr 1fr, 14px gap, 6px top offset) that every Settings
  card uses. Typed equivalent of `<div class="form-row">` from
  @w5-ui/tokens/dashboard.css. Use inside wider <Card> tiles for dense editors.
-->
<div class="form-row {className}">
  {@render children?.()}
</div>
