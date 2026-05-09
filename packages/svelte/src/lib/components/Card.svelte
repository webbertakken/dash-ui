<script lang="ts">
  export let span: number | undefined = undefined;
  let className = '';
  export { className as class };
  export let style: string = '';
  $: spanStyle = span !== undefined ? `grid-column: span ${span};` : '';
</script>

<div class="card {className}" style="{spanStyle} {style}">
  <slot />
</div>
