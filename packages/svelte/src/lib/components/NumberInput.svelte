<script module lang="ts">
  let counter = 0;
</script>

<script lang="ts">
  

  interface Props {
    label?: string | undefined;
    value?: number;
    min?: number | undefined;
    max?: number | undefined;
    step?: number;
    suffix?: string | undefined;
    disabled?: boolean;
    id?: string | undefined;
    class?: string;
    onchange?: (payload: number) => void;
  }

  let {
    label = undefined,
    value = $bindable(0),
    min = undefined,
    max = undefined,
    step = 1,
    suffix = undefined,
    disabled = false,
    id = undefined,
    class: className = '',
    onchange,
  }: Props = $props();
  

  const uid = `dash-ui-ni-${++counter}`;
  let inputId = $derived(id ?? uid);
  function clamp(n: number): number {
    let v = n;
    if (min !== undefined) v = Math.max(min, v);
    if (max !== undefined) v = Math.min(max, v);
    return v;
  }

  function commit(next: number) {
    value = clamp(next);
    onchange?.(value);
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

  let canDecrement = $derived(!disabled && (min === undefined || value > min));
  let canIncrement = $derived(!disabled && (max === undefined || value < max));
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
      onclick={() => commit(value - step)}
    >−</button>
    <!-- svelte-ignore a11y_no_redundant_roles - role kept explicit for screen reader compat -->
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
      onchange={handleChange}
      onkeydown={handleKey}
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
      onclick={() => commit(value + step)}
    >+</button>
  </div>
</div>
