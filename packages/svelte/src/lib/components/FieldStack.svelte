<script lang="ts">
  interface Props {
    class?: string;
    children?: import('svelte').Snippet;
  }

  let { class: className = '', children }: Props = $props();
</script>

<!--
  Single-column form rhythm: a vertical stack of <Field>s with the canonical
  16px gap. Typed equivalent of `<div class="field-stack">` from
  @w5-ui/tokens/dashboard.css. Reach for this inside narrow <Card> tiles and
  <Modal> bodies.
-->
<div class="field-stack {className}">
  {@render children?.()}
</div>
