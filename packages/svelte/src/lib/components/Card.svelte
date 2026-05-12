<script lang="ts">
  
  interface Props {
    span?: number | undefined;
    class?: string;
    style?: string;
    children?: import('svelte').Snippet;
  }

  let {
    span = undefined,
    class: className = '',
    style = '',
    children
  }: Props = $props();
  let spanStyle = $derived(span !== undefined ? `grid-column: span ${span};` : '');
</script>

<div class="card {className}" style="{spanStyle} {style}">
  {@render children?.()}
</div>
