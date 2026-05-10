<script context="module" lang="ts">
  export type { JsVal } from './JsonViewerNode.svelte';
</script>

<script lang="ts">
  import JsonViewerNode from './JsonViewerNode.svelte';
  export let data: unknown;
  export let label: string = 'JSON viewer';
  export let defaultExpanded: boolean = true;
  export let maxDepth: number = 3;
</script>

<div class="json-viewer" role="tree" aria-label={label}>
  <JsonViewerNode v={data} depth={0} {maxDepth} startOpen={defaultExpanded} />
</div>
