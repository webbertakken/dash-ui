<script context="module" lang="ts">
  let counter = 0;
</script>

<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  export let label: string | undefined = undefined;
  export let value: number = 0;
  export let min: number | undefined = undefined;
  export let max: number | undefined = undefined;
  export let step: number = 1;
  export let suffix: string | undefined = undefined;
  export let disabled: boolean = false;
  export let id: string | undefined = undefined;
  let className = '';
  export { className as class };

  const uid = `dash-ui-ni-${++counter}`;
  $: inputId = id ?? uid;

  const dispatch = createEventDispatcher<{ change: number }>();

  function clamp(n: number): number {
    let v = n;
    if (min !== undefined) v = Math.max(min, v);
    if (max !== undefined) v = Math.min(max, v);
    return v;
  }

  function commit(next: number) {
    value = clamp(next);
    dispatch('change', value);
  }

  function handleKey(e: KeyboardEvent) {
    if (e.key === 'ArrowUp') { e.preventDefault(); commit(value + step); }
    else if (e.key === 'ArrowDown') { e.preventDefault(); commit(value - step); }
    else if (e.key === 'PageUp') { e.preventDefault(); commit(value + step * 10); }
    else if (e.key === 'PageDown') { e.preventDefault(); commit(value - step * 10); }
    else if (e.key === 'Home' && min !== undefined) { e.preventDefault(); commit(min); }
    else if (e.key === 'End' && max !== undefined) { e.preventDefault(); commit(max); }
  }

  function handleChange(e: Event) {
    const n = Number((e.target as HTMLInputElement).value);
    if (!isNaN(n)) commit(n);
  }

  $: canDecrement = !disabled && (min === undefined || value > min);
  $: canIncrement = !disabled && (max === undefined || value < max);
</script>

<div class="number-input {className}">
  {#if label}
    <label for={inputId} class="number-input__label">{label}</label>
  {/if}
  <div class="number-input__control">
    <button
      type="button"
      class="number-input__btn"
      aria-label="Decrement"
      tabindex="-1"
      disabled={!canDecrement}
      on:click={() => commit(value - step)}
    >−</button>
    <input
      id={inputId}
      type="number"
      role="spinbutton"
      aria-valuenow={value}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuetext={suffix ? `${value} ${suffix}` : undefined}
      {value}
      {disabled}
      class="number-input__field"
      on:change={handleChange}
      on:keydown={handleKey}
    />
    {#if suffix}
      <span class="number-input__suffix" aria-hidden="true">{suffix}</span>
    {/if}
    <button
      type="button"
      class="number-input__btn"
      aria-label="Increment"
      tabindex="-1"
      disabled={!canIncrement}
      on:click={() => commit(value + step)}
    >+</button>
  </div>
</div>
