<script module lang="ts">
  let counter = 0;
</script>

<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  interface Props {
    label?: string | undefined;
    value?: number;
    maxHours?: number;
    disabled?: boolean;
    class?: string;
  }

  let {
    label = undefined,
    value = $bindable(0),
    maxHours = 99,
    disabled = false,
    class: className = ''
  }: Props = $props();
  

  const dispatch = createEventDispatcher<{ change: number }>();
  const uid = `dash-ui-dur-${++counter}`;

  function toHMS(secs: number): [number, number, number] {
    const t = Math.max(0, secs);
    return [Math.floor(t / 3600), Math.floor((t % 3600) / 60), t % 60];
  }

  function fromHMS(h: number, m: number, s: number): number {
    return h * 3600 + m * 60 + s;
  }

  function pad(n: number): string {
    return String(n).padStart(2, '0');
  }

  let [hours, minutes, seconds] = $derived(toHMS(value));

  let inputs: [HTMLInputElement | null, HTMLInputElement | null, HTMLInputElement | null] = $state([null, null, null]);

  function focusAt(i: number) {
    const el = inputs[i];
    if (el) { el.focus(); el.select(); }
  }

  function commit(h: number, m: number, s: number) {
    value = fromHMS(Math.min(maxHours, h), m, s);
    dispatch('change', value);
  }

  function handleKey(field: number, e: KeyboardEvent) {
    const vals: [number, number, number] = [hours, minutes, seconds];
    const maxes = [maxHours, 59, 59];
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      vals[field] = vals[field] >= maxes[field] ? 0 : vals[field] + 1;
      commit(...vals);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      vals[field] = vals[field] <= 0 ? maxes[field] : vals[field] - 1;
      commit(...vals);
    } else if ((e.key === ':' || e.key === 'ArrowRight') && field < 2) {
      e.preventDefault();
      focusAt(field + 1);
    } else if (e.key === 'ArrowLeft' && field > 0) {
      e.preventDefault();
      focusAt(field - 1);
    }
  }

  function handleInput(field: number, e: Event) {
    const raw = (e.currentTarget as HTMLInputElement).value;
    if (!/^\d{0,2}$/.test(raw)) return;
    const n = parseInt(raw, 10);
    if (isNaN(n)) return;
    const maxes = [maxHours, 59, 59];
    const updated: [number, number, number] = [hours, minutes, seconds];
    updated[field] = Math.min(maxes[field], n);
    commit(...updated);
    if (raw.length === 2 && field < 2) setTimeout(() => focusAt(field + 1), 0);
  }

  const FIELDS = [
    { idx: 0, ariaLabel: 'Hours' },
    { idx: 1, ariaLabel: 'Minutes' },
    { idx: 2, ariaLabel: 'Seconds' },
  ];

  let fieldVals = $derived([hours, minutes, seconds]);
  let fieldMaxes = $derived([maxHours, 59, 59]);
</script>

<div class="dur-input-wrapper {className}">
  {#if label}
    <label for="{uid}-h" class="dur-input__label">{label}</label>
  {/if}
  <div class="dur-input{disabled ? ' dur-input--disabled' : ''}" role="group" aria-label={label ?? 'Duration'}>
    {#each FIELDS as { idx, ariaLabel }, i}
      <input
        bind:this={inputs[idx]}
        id={idx === 0 ? `${uid}-h` : undefined}
        type="text"
        inputmode="numeric"
        pattern="[0-9]*"
        role="spinbutton"
        aria-label={ariaLabel}
        aria-valuenow={fieldVals[idx]}
        aria-valuemin={0}
        aria-valuemax={fieldMaxes[idx]}
        aria-valuetext={pad(fieldVals[idx])}
        value={pad(fieldVals[idx])}
        {disabled}
        maxlength={2}
        class="dur-input__field"
        oninput={(e) => handleInput(idx, e)}
        onkeydown={(e) => handleKey(idx, e)}
        onfocus={(e) => e.currentTarget.select()}
      />
      {#if i < 2}
        <span class="dur-input__sep" aria-hidden="true">:</span>
      {/if}
    {/each}
  </div>
</div>
