<script lang="ts">
  interface Props {
    class?: string;
    children?: import('svelte').Snippet;
  }

  let { class: className = '', children }: Props = $props();
</script>

<!--
  Rounded, bordered wrapper for any full-width <table> on a page. Carries the
  8px radius, --neutral-09 background, single 1px border and overflow: hidden
  clip. Typed equivalent of `<div class="table-shell">` from
  @w5-ui/tokens/dashboard.css. Render <Pagination> as a sibling below, not
  inside, so focus rings aren't clipped.
-->
<div class="table-shell {className}">
  {@render children?.()}
</div>
