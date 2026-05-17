<script module lang="ts">
  export type JsVal = string | number | boolean | null | JsVal[] | { [k: string]: JsVal };
</script>

<script lang="ts">
  import JsonViewerNode from './JsonViewerNode.svelte';

  interface Props {
    v: JsVal;
    k?: string | undefined;
    depth?: number;
    maxDepth?: number;
    startOpen?: boolean;
  }

  let { v, k = undefined, depth = 0, maxDepth = 3, startOpen = true }: Props = $props();

  let isArr = $derived(Array.isArray(v));
  let isObj = $derived(v !== null && typeof v === 'object');
  let expandable = $derived(isArr || isObj);

  // svelte-ignore state_referenced_locally
  let open = $state(startOpen && depth < maxDepth);

  let entries = $derived(
    isArr
      ? (v as JsVal[]).map((item: JsVal, i: number) => ({ ek: String(i), ev: item, arrItem: true }))
      : isObj
        ? Object.entries(v as { [key: string]: JsVal }).map(([ek, ev]) => ({ ek, ev, arrItem: false }))
        : [],
  );
  let count = $derived(entries.length);
  let ob = $derived(isArr ? '[' : '{');
  let cb = $derived(isArr ? ']' : '}');
  let indent = $derived(depth * 14);

  // Syntax-highlight palette is motif-aware: dark uses the familiar
  // VS Code dark-plus accents; light flips to a calmer, slightly
  // higher-contrast set tuned for #ffffff page bg.
  const KEY = 'text-[#9cdcfe] dark:text-[#9cdcfe] light:text-[#0451a5]';
  const COLON = 'text-text-4';
  const NULL = 'text-text-4 italic';
  const STR = 'text-[#ce9178] dark:text-[#ce9178] light:text-[#a31515]';
  const NUM = 'text-[#b5cea8] dark:text-[#b5cea8] light:text-[#098658]';
  const BOOL = 'text-[#569cd6] dark:text-[#569cd6] light:text-[#0000ff]';
  const BRACKET = 'text-text-2';
  const COUNT = 'text-text-4 tabular-nums px-1';
</script>

{#if !expandable}
  <div role="treeitem" aria-selected="false" class="px-3 py-px" style:padding-left="{indent + 12}px">
    {#if k != null}<span class={KEY}>"{k}"</span><span class={COLON}>: </span>{/if}
    {#if v === null}<span class={NULL}>null</span>
    {:else if typeof v === 'string'}<span class={STR}>"{v}"</span>
    {:else if typeof v === 'number'}<span class={NUM}>{v}</span>
    {:else}<span class={BOOL}>{String(v)}</span>{/if}
  </div>
{:else}
  <div role="treeitem" aria-selected="false" aria-expanded={open} class="block">
    <button
      type="button"
      aria-label={`${open ? 'Collapse' : 'Expand'} ${k ?? (isArr ? 'array' : 'object')}`}
      class="flex w-full cursor-pointer items-baseline border-0 bg-transparent px-3 py-px text-left font-mono text-12 leading-[1.8] hover:bg-divider focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-brand-05"
      style:padding-left="{indent}px"
      onclick={() => (open = !open)}
    >
      <span class="mr-1 inline-block w-3 text-text-4" aria-hidden="true">{open ? '▾' : '▸'}</span>
      {#if k != null}<span class={KEY}>"{k}"</span><span class={COLON}>: </span>{/if}
      <span class={BRACKET}>{ob}</span>
      {#if !open}<span class={COUNT}>&thinsp;{count}&thinsp;</span><span class={BRACKET}>{cb}</span>{/if}
    </button>
    {#if open}
      <div role="group" class="block">
        {#each entries as { ek, ev, arrItem } (ek)}
          <JsonViewerNode v={ev} k={arrItem ? undefined : ek} depth={depth + 1} {maxDepth} {startOpen} />
        {/each}
        <div class="px-3 py-px" style:padding-left="{indent + 12}px">
          <span class={BRACKET}>{cb}</span>
        </div>
      </div>
    {/if}
  </div>
{/if}
