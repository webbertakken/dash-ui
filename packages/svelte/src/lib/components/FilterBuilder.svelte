<script module lang="ts">
  let counter = 0;
  export interface FilterField {
    key: string;
    label: string;
    type?: 'text' | 'number' | 'select';
    options?: string[];
  }
  export interface FilterRule {
    id: string;
    field: string;
    op: string;
    value: string;
  }

  const TEXT_OPS = ['contains', 'not contains', 'equals', 'not equals', 'starts with'];
  const NUM_OPS = ['equals', 'not equals', 'greater than', 'less than', 'at least', 'at most'];
  const SEL_OPS = ['is', 'is not'];

  function opsFor(type?: string) {
    if (type === 'number') return NUM_OPS;
    if (type === 'select') return SEL_OPS;
    return TEXT_OPS;
  }
  function defaultOp(type?: string) {
    return opsFor(type)[0];
  }
</script>

<script lang="ts">
  interface Props {
    fields?: FilterField[];
    value?: FilterRule[];
    conjunction?: 'and' | 'or';
    ariaLabel?: string;
    onchange?: (payload: { rules: FilterRule[]; conjunction: 'and' | 'or' }) => void;
  }

  let {
    fields = [],
    value = [],
    conjunction = 'and',
    ariaLabel = 'Filter builder',
    onchange,
  }: Props = $props();

  const uid = `dash-ui-fb-${++counter}`;
  const CONJUNCTIONS = ['and', 'or'] as const;

  function emit(rules: FilterRule[], conj: 'and' | 'or' = conjunction) {
    onchange?.({ rules, conjunction: conj });
  }

  function addRule() {
    const f = fields[0];
    emit([...value, { id: String(Date.now()), field: f?.key ?? '', op: defaultOp(f?.type), value: '' }]);
  }

  function removeRule(id: string) {
    emit(value.filter((r) => r.id !== id));
  }

  function setField(id: string, key: string) {
    const f = fields.find((x) => x.key === key);
    emit(value.map((r) => (r.id === id ? { ...r, field: key, op: defaultOp(f?.type), value: '' } : r)));
  }

  function setOp(id: string, op: string) {
    emit(value.map((r) => (r.id === id ? { ...r, op } : r)));
  }

  function setValue(id: string, v: string) {
    emit(value.map((r) => (r.id === id ? { ...r, value: v } : r)));
  }

  // Field chrome: select chevron uses a data-URL bg so the chrome stays in
  // class strings rather than scoped CSS.
  const SELECT_CHEVRON =
    'background-image:url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'10\' height=\'6\' viewBox=\'0 0 10 6\'%3E%3Cpath d=\'M1 1l4 4 4-4\' stroke=\'%236E7079\' stroke-width=\'1.5\' fill=\'none\' stroke-linecap=\'round\'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 8px center;';

  const SELECT_CLS =
    'h-[30px] cursor-pointer appearance-none rounded border border-white/10 bg-white/[0.06] px-2 pr-6 text-13 leading-none text-[#e1e2e8] outline-none transition-colors duration-100 hover:border-white/20 focus:border-brand-05';
  const INPUT_CLS =
    'h-[30px] min-w-[140px] flex-1 rounded border border-white/10 bg-white/[0.06] px-2 text-13 leading-none text-[#e1e2e8] outline-none transition-colors duration-100 placeholder:text-[#6e7079] hover:border-white/20 focus:border-brand-05';
</script>

<div class="flex flex-col gap-1.5" role="group" aria-label={ariaLabel}>
  <div class="flex min-h-8 flex-wrap items-center gap-2">
    <span class="mr-1 text-12 font-semibold uppercase tracking-[0.05em] text-text-3">Filters</span>
    {#if value.length > 0}
      <span class="text-13 text-[#6e7079]">Match</span>
      <div class="flex overflow-hidden rounded border border-white/10" role="group" aria-label="Conjunction">
        {#each CONJUNCTIONS as c}
          <button
            type="button"
            aria-pressed={conjunction === c}
            class="cursor-pointer border-0 bg-transparent px-2.5 py-0.5 text-11 font-bold uppercase tracking-[0.06em] text-[#6e7079] hover:bg-white/[0.06] hover:text-[#e1e2e8] aria-pressed:bg-brand-05/[0.18] aria-pressed:text-[#7fb6ff] focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-brand-05"
            onclick={() => emit(value, c)}
          >{c.toUpperCase()}</button>
        {/each}
      </div>
      <span class="text-13 text-[#6e7079]">conditions</span>
    {/if}
    <button
      type="button"
      aria-label="Add filter rule"
      class="ml-auto cursor-pointer rounded border border-dashed border-white/[0.14] bg-transparent px-2.5 py-1 text-12 leading-none text-brand-05 hover:border-brand-05 hover:bg-brand-05/[0.08] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-05"
      onclick={addRule}
    >+ Add rule</button>
    {#if value.length > 0}
      <button
        type="button"
        aria-label="Clear all filters"
        class="cursor-pointer border-0 bg-transparent px-1.5 py-1 text-12 leading-none text-[#6e7079] hover:text-[#e1e2e8] focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-05"
        onclick={() => emit([])}
      >Clear</button>
    {/if}
  </div>
  {#if value.length > 0}
    <ul class="m-0 flex list-none flex-col gap-1 p-0" aria-label="Filter rules">
      {#each value as rule, i}
        {@const f = fields.find((x) => x.key === rule.field)}
        {@const ops = opsFor(f?.type)}
        {@const fieldId = `${uid}-f${i}`}
        {@const opId = `${uid}-op${i}`}
        {@const valId = `${uid}-v${i}`}
        <li class="flex items-center gap-1.5">
          <label class="sr-only" for={fieldId}>Field {i + 1}</label>
          <select
            id={fieldId}
            class={SELECT_CLS}
            style={SELECT_CHEVRON}
            value={rule.field}
            onchange={(e) => setField(rule.id, e.currentTarget.value)}
            aria-label={`Rule ${i + 1} field`}
          >
            {#each fields as x}
              <option value={x.key}>{x.label}</option>
            {/each}
          </select>
          <label class="sr-only" for={opId}>Operator {i + 1}</label>
          <select
            id={opId}
            class={SELECT_CLS}
            style={SELECT_CHEVRON}
            value={rule.op}
            onchange={(e) => setOp(rule.id, e.currentTarget.value)}
            aria-label={`Rule ${i + 1} operator`}
          >
            {#each ops as op}
              <option value={op}>{op}</option>
            {/each}
          </select>
          <label class="sr-only" for={valId}>Value {i + 1}</label>
          {#if f?.type === 'select'}
            <select
              id={valId}
              class={SELECT_CLS}
              style={SELECT_CHEVRON}
              value={rule.value}
              onchange={(e) => setValue(rule.id, e.currentTarget.value)}
              aria-label={`Rule ${i + 1} value`}
            >
              <option value="">Any</option>
              {#each f.options ?? [] as o}
                <option value={o}>{o}</option>
              {/each}
            </select>
          {:else}
            <input
              id={valId}
              class={INPUT_CLS}
              type={f?.type === 'number' ? 'number' : 'text'}
              value={rule.value}
              placeholder="Value…"
              oninput={(e) => setValue(rule.id, e.currentTarget.value)}
              aria-label={`Rule ${i + 1} value`}
            />
          {/if}
          <button
            type="button"
            aria-label={`Remove rule ${i + 1}`}
            class="flex h-[26px] w-[26px] shrink-0 cursor-pointer items-center justify-center rounded-md border-0 bg-transparent text-[#6e7079] hover:bg-status-danger/10 hover:text-status-danger focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-05"
            onclick={() => removeRule(rule.id)}
          >
            <svg viewBox="0 0 12 12" width="10" height="10" aria-hidden="true" fill="currentColor">
              <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
            </svg>
          </button>
        </li>
      {/each}
    </ul>
  {/if}
</div>
