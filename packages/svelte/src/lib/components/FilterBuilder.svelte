<script context="module" lang="ts">
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
  const NUM_OPS  = ['equals', 'not equals', 'greater than', 'less than', 'at least', 'at most'];
  const SEL_OPS  = ['is', 'is not'];

  function opsFor(type?: string) {
    if (type === 'number') return NUM_OPS;
    if (type === 'select') return SEL_OPS;
    return TEXT_OPS;
  }
  function defaultOp(type?: string) { return opsFor(type)[0]; }
</script>

<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  export let fields: FilterField[] = [];
  export let value: FilterRule[] = [];
  export let conjunction: 'and' | 'or' = 'and';
  export let ariaLabel = 'Filter builder';

  const uid = `dash-ui-fb-${++counter}`;
  const dispatch = createEventDispatcher<{ change: { rules: FilterRule[]; conjunction: 'and' | 'or' } }>();

  function emit(rules: FilterRule[], conj: 'and' | 'or' = conjunction) {
    dispatch('change', { rules, conjunction: conj });
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
    emit(value.map((r) => r.id === id ? { ...r, field: key, op: defaultOp(f?.type), value: '' } : r));
  }

  function setOp(id: string, op: string) {
    emit(value.map((r) => r.id === id ? { ...r, op } : r));
  }

  function setValue(id: string, v: string) {
    emit(value.map((r) => r.id === id ? { ...r, value: v } : r));
  }
</script>

<div class="fb" role="group" aria-label={ariaLabel}>
  <div class="fb-header">
    <span class="fb-label">Filters</span>
    {#if value.length > 0}
      <span class="fb-conj-label">Match</span>
      <div class="fb-conj" role="group" aria-label="Conjunction">
        {#each ['and', 'or'] as c}
          <button
            type="button"
            class="fb-conj-btn{conjunction === c ? ' is-active' : ''}"
            aria-pressed={conjunction === c}
            on:click={() => emit(value, c)}
          >{c.toUpperCase()}</button>
        {/each}
      </div>
      <span class="fb-conj-label">conditions</span>
    {/if}
    <button type="button" class="fb-add" on:click={addRule} aria-label="Add filter rule">+ Add rule</button>
    {#if value.length > 0}
      <button type="button" class="fb-clear" on:click={() => emit([])} aria-label="Clear all filters">Clear</button>
    {/if}
  </div>
  {#if value.length > 0}
    <ul class="fb-rules" aria-label="Filter rules">
      {#each value as rule, i}
        {@const f = fields.find((x) => x.key === rule.field)}
        {@const ops = opsFor(f?.type)}
        {@const fieldId = `${uid}-f${i}`}
        {@const opId = `${uid}-op${i}`}
        {@const valId = `${uid}-v${i}`}
        <li class="fb-rule">
          <label class="sr-only" for={fieldId}>Field {i + 1}</label>
          <select
            id={fieldId}
            class="fb-select"
            value={rule.field}
            on:change={(e) => setField(rule.id, e.currentTarget.value)}
            aria-label="Rule {i + 1} field"
          >
            {#each fields as x}
              <option value={x.key}>{x.label}</option>
            {/each}
          </select>
          <label class="sr-only" for={opId}>Operator {i + 1}</label>
          <select
            id={opId}
            class="fb-select fb-select--op"
            value={rule.op}
            on:change={(e) => setOp(rule.id, e.currentTarget.value)}
            aria-label="Rule {i + 1} operator"
          >
            {#each ops as op}
              <option value={op}>{op}</option>
            {/each}
          </select>
          <label class="sr-only" for={valId}>Value {i + 1}</label>
          {#if f?.type === 'select'}
            <select
              id={valId}
              class="fb-select fb-select--val"
              value={rule.value}
              on:change={(e) => setValue(rule.id, e.currentTarget.value)}
              aria-label="Rule {i + 1} value"
            >
              <option value="">Any</option>
              {#each f.options ?? [] as o}
                <option value={o}>{o}</option>
              {/each}
            </select>
          {:else}
            <input
              id={valId}
              class="fb-input"
              type={f?.type === 'number' ? 'number' : 'text'}
              value={rule.value}
              placeholder="Value…"
              on:input={(e) => setValue(rule.id, e.currentTarget.value)}
              aria-label="Rule {i + 1} value"
            />
          {/if}
          <button
            type="button"
            class="fb-remove icon-btn"
            on:click={() => removeRule(rule.id)}
            aria-label="Remove rule {i + 1}"
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
