<script module lang="ts">
  export type { JsVal } from './JsonViewerNode.svelte';
</script>

<script lang="ts">
  import JsonViewerNode from './JsonViewerNode.svelte';
  import type { JsVal } from './JsonViewerNode.svelte';

  interface Props {
    data: unknown;
    label?: string;
    defaultExpanded?: boolean;
    maxDepth?: number;
  }

  let {
    data,
    label = 'JSON viewer',
    defaultExpanded = true,
    maxDepth = 3,
  }: Props = $props();
  let root = $derived(data as JsVal);
</script>

<div
  class="overflow-auto rounded-md border border-white/[0.08] bg-[#0a0a0b] py-2 font-mono text-12 leading-[1.8]"
  role="tree"
  aria-label={label}
>
  <JsonViewerNode v={root} depth={0} {maxDepth} startOpen={defaultExpanded} />
</div>
