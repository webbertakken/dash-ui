<script lang="ts">
  interface Props {
    class?: string;
    children?: import('svelte').Snippet;
  }

  let { class: className = '', children }: Props = $props();
</script>

<!--
  Right-aligned action row closing a form <Card> or modal body
  (display:flex; justify-content:flex-end; gap:8px; margin-top:16px).
  Typed equivalent of `<div class="form-actions">` from
  @w5-ui/tokens/dashboard.css.
-->
<div class="form-actions {className}">
  {@render children?.()}
</div>
