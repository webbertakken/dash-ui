<script lang="ts">
  import TreeBrowser from '../../lib/components/TreeBrowser.svelte'
  import type {
    TreeBrowserCollection,
    TreeBrowserItem,
  } from '../../lib/components/tree-browser-model.ts'

  interface Props {
    collections: Record<string, TreeBrowserCollection>
    items?: Record<string, TreeBrowserItem>
    rootId?: string
    defaultExpanded?: string[]
  }

  let { collections, items = {}, rootId = 'root', defaultExpanded = [] }: Props = $props()
</script>

<TreeBrowser {collections} {items} {rootId} {defaultExpanded} label="Files">
  {#snippet itemIcon(ctx)}
    <span data-testid={`icon-${ctx.id}`} data-kind={ctx.type}>*</span>
  {/snippet}
  {#snippet badge(ctx)}
    {#if ctx.id === 'rules'}
      <span data-testid={`badge-${ctx.id}`}>missing</span>
    {/if}
  {/snippet}
</TreeBrowser>
