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

  const BTN_CLS =
    'inline-flex h-full w-[30px] shrink-0 cursor-pointer items-center justify-center border-0 bg-transparent text-base text-[#6e7079] transition-[background-color,color] duration-100 hover:bg-white/[0.04] hover:text-white disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-brand-05';
</script>

<div class="inline-flex flex-col gap-1 {className}">
  {#if label}
    <label for={inputId} class="text-12 text-[#6e7079]">{label}</label>
  {/if}
  <div class="inline-flex h-[34px] items-stretch overflow-hidden rounded-md border border-white/10 bg-[#0a0a0b] transition-colors duration-100 focus-within:border-brand-05">
    <button
      type="button"
      aria-label="Decrement"
      tabindex={-1}
      disabled={!canDecrement}
      class={BTN_CLS}
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
      class="w-[6ch] min-w-[40px] border-0 bg-transparent px-1 text-center text-13 text-white outline-none [appearance:textfield] [-moz-appearance:textfield] [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none"
      onchange={handleChange}
      onkeydown={handleKey}
    />
    {#if suffix}
      <span aria-hidden="true" class="flex items-center whitespace-nowrap pl-0.5 pr-2 text-12 text-[#6e7079]">{suffix}</span>
    {/if}
    <button
      type="button"
      aria-label="Increment"
      tabindex={-1}
      disabled={!canIncrement}
      class={BTN_CLS}
      onclick={() => commit(value + step)}
    >+</button>
  </div>
</div>
