<script module lang="ts">
  let counter = 0;
</script>

<script lang="ts">
  

  interface Props {
    label?: string | undefined;
    value?: string;
    disabled?: boolean;
    class?: string;
    onchange?: (payload: string) => void;
  }

  let {
    label = undefined,
    value = $bindable('00:00'),
    disabled = false,
    class: className = '',
    onchange,
  }: Props = $props();
  const uid = `dash-ui-tp-${++counter}`;

  function pad(n: number): string {
    return String(n).padStart(2, '0');
  }

  function parseTime(t: string): [number, number] {
    const [h = '0', m = '0'] = t.split(':');
    return [
      Math.min(23, Math.max(0, parseInt(h, 10) || 0)),
      Math.min(59, Math.max(0, parseInt(m, 10) || 0)),
    ];
  }

  let [hours, minutes] = $derived(parseTime(value));

  let inputs: [HTMLInputElement | null, HTMLInputElement | null] = $state([null, null]);

  function commit(h: number, m: number) {
    value = `${pad(h)}:${pad(m)}`;
    onchange?.(value);
  }

  function handleKey(field: 0 | 1, e: KeyboardEvent) {
    const val = field === 0 ? hours : minutes;
    const max = field === 0 ? 23 : 59;
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      const next = val >= max ? 0 : val + 1;
      field === 0 ? commit(next, minutes) : commit(hours, next);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const next = val <= 0 ? max : val - 1;
      field === 0 ? commit(next, minutes) : commit(hours, next);
    } else if ((e.key === ':' || e.key === 'ArrowRight') && field === 0) {
      e.preventDefault();
      inputs[1]?.focus();
    } else if (e.key === 'ArrowLeft' && field === 1) {
      e.preventDefault();
      inputs[0]?.focus();
    }
  }

  function handleInput(field: 0 | 1, e: Event) {
    const raw = (e.target as HTMLInputElement).value;
    if (!/^\d{0,2}$/.test(raw)) return;
    const n = parseInt(raw, 10);
    if (isNaN(n)) return;
    const max = field === 0 ? 23 : 59;
    const clamped = Math.min(max, n);
    field === 0 ? commit(clamped, minutes) : commit(hours, clamped);
    if (raw.length === 2 && field === 0) setTimeout(() => inputs[1]?.focus(), 0);
  }
</script>

<div class="time-picker-wrapper {className}">
  {#if label}
    <label for="{uid}-h" class="time-picker__label">{label}</label>
  {/if}
  <div class="time-picker{disabled ? ' time-picker--disabled' : ''}" role="group" aria-label={label ?? 'Time'}>
    <input
      bind:this={inputs[0]}
      id="{uid}-h"
      type="text"
      inputmode="numeric"
      pattern="[0-9]*"
      role="spinbutton"
      aria-label="Hours"
      aria-valuenow={hours}
      aria-valuemin={0}
      aria-valuemax={23}
      aria-valuetext={pad(hours)}
      value={pad(hours)}
      {disabled}
      maxlength={2}
      class="time-picker__field"
      oninput={(e) => handleInput(0, e)}
      onkeydown={(e) => handleKey(0, e)}
      onfocus={(e) => e.currentTarget.select()}
    />
    <span class="time-picker__sep" aria-hidden="true">:</span>
    <input
      bind:this={inputs[1]}
      type="text"
      inputmode="numeric"
      pattern="[0-9]*"
      role="spinbutton"
      aria-label="Minutes"
      aria-valuenow={minutes}
      aria-valuemin={0}
      aria-valuemax={59}
      aria-valuetext={pad(minutes)}
      value={pad(minutes)}
      {disabled}
      maxlength={2}
      class="time-picker__field"
      oninput={(e) => handleInput(1, e)}
      onkeydown={(e) => handleKey(1, e)}
      onfocus={(e) => e.currentTarget.select()}
    />
  </div>
</div>
