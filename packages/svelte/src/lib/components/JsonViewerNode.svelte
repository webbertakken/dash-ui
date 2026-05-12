<script context="module" lang="ts">
  export type JsVal = string | number | boolean | null | JsVal[] | { [k: string]: JsVal };
</script>

<script lang="ts">
  export let v: JsVal;
  export let k: string | undefined = undefined;
  export let depth = 0;
  export let maxDepth = 3;
  export let startOpen = true;

  $: isArr = Array.isArray(v);
  $: isObj = v !== null && typeof v === 'object';
  $: expandable = isArr || isObj;

  let open = startOpen && depth < maxDepth;

  $: entries = isArr
    ? (v as JsVal[]).map((item: JsVal, i: number) => ({ ek: String(i), ev: item, arrItem: true }))
    : isObj
    ? Object.entries(v as { [key: string]: JsVal }).map(([ek, ev]) => ({ ek, ev, arrItem: false }))
    : [];
  $: count = entries.length;
  $: ob = isArr ? '[' : '{';
  $: cb = isArr ? ']' : '}';
  $: indent = depth * 14;
</script>

{#if !expandable}
  <div role="treeitem" aria-selected="false" class="jv-row" style:padding-left="{indent}px">
    {#if k != null}<span class="jv-key">"{k}"</span><span class="jv-colon">: </span>{/if}
    {#if v === null}<span class="jv-null">null</span>
    {:else if typeof v === 'string'}<span class="jv-string">"{v}"</span>
    {:else if typeof v === 'number'}<span class="jv-number">{v}</span>
    {:else}<span class="jv-boolean">{String(v)}</span>{/if}
  </div>
{:else}
  <div role="treeitem" aria-selected="false" aria-expanded={open} class="jv-node">
    <button
      type="button"
      class="jv-toggle-row"
      on:click={() => (open = !open)}
      aria-label="{open ? 'Collapse' : 'Expand'} {k ?? (isArr ? 'array' : 'object')}"
      style:padding-left="{indent}px"
    >
      <span class="jv-caret" aria-hidden="true">{open ? '▾' : '▸'}</span>
      {#if k != null}<span class="jv-key">"{k}"</span><span class="jv-colon">: </span>{/if}
      <span class="jv-bracket">{ob}</span>
      {#if !open}<span class="jv-count">&thinsp;{count}&thinsp;</span><span class="jv-bracket">{cb}</span>{/if}
    </button>
    {#if open}
      <div role="group" class="jv-children">
        {#each entries as { ek, ev, arrItem } (ek)}
          <svelte:self v={ev} k={arrItem ? undefined : ek} depth={depth + 1} {maxDepth} {startOpen} />
        {/each}
        <div class="jv-row jv-close" style:padding-left="{indent}px">
          <span class="jv-bracket">{cb}</span>
        </div>
      </div>
    {/if}
  </div>
{/if}
