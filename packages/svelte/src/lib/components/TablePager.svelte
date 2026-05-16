<script lang="ts">
  interface Props {
    class?: string;
    children?: import('svelte').Snippet;
  }

  let { class: className = '', children }: Props = $props();
</script>

<!--
  Sibling row that sits directly under a <TableShell> (or
  <div class="table-shell">) and carries the rows-per-page control on the
  left and the <Pagination> nav on the right. Renders the canonical
  <div class="table-pager"> markup so the flex / space-between / 12px top
  margin from @w5-ui/tokens/dashboard.css applies and userland drops the
  inline flex / space-between wrapper that every reference page used to ship.
  Render as a sibling of <TableShell>, never inside it, so focus rings on the
  pager buttons aren't clipped.
-->
<div class="table-pager {className}">
  {@render children?.()}
</div>
