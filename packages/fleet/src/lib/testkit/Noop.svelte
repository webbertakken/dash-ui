<script lang="ts">
  // Passthrough stub for xyflow components in unit tests: renders its
  // children (if any) and nothing else, so a component under test can
  // mount without a real SvelteFlow / NodeProvider context.
  import type { Snippet } from 'svelte'
  let { children }: { children?: Snippet } = $props()
</script>

{#if children}{@render children()}{/if}
