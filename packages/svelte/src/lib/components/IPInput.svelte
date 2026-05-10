<script context="module" lang="ts">
  let counter = 0;
</script>

<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  export let label: string | undefined = undefined;
  export let value: string = '0.0.0.0';
  export let disabled: boolean = false;
  let className = '';
  export { className as class };

  const dispatch = createEventDispatcher<{ change: string }>();
  const uid = `dash-ui-ip-${++counter}`;

  function clampOctet(s: string): string {
    if (s === '') return s;
    const n = Number(s);
    if (isNaN(n)) return s;
    return String(Math.min(255, Math.max(0, n)));
  }

  function parseIP(ip: string): [string, string, string, string] {
    const parts = ip.split('.');
    return [parts[0] ?? '0', parts[1] ?? '0', parts[2] ?? '0', parts[3] ?? '0'];
  }

  let octets: [string, string, string, string] = parseIP(value);
  let inputs: (HTMLInputElement | null)[] = [null, null, null, null];

  function focusAt(i: number) {
    const el = inputs[i];
    if (el) { el.focus(); el.select(); }
  }

  function commitOctet(i: number, raw: string) {
    if (!/^\d{0,3}$/.test(raw)) return;
    octets[i] = clampOctet(raw);
    octets = octets as [string, string, string, string];
    value = octets.join('.');
    dispatch('change', value);
    if (raw.length === 3 && i < 3) setTimeout(() => focusAt(i + 1), 0);
  }

  function handleKey(i: number, e: KeyboardEvent) {
    const el = inputs[i]!;
    if (e.key === '.') {
      e.preventDefault();
      if (i < 3) focusAt(i + 1);
    } else if (e.key === 'ArrowRight' && el.selectionStart === el.value.length) {
      if (i < 3) { e.preventDefault(); focusAt(i + 1); }
    } else if (e.key === 'ArrowLeft' && el.selectionStart === 0) {
      if (i > 0) { e.preventDefault(); focusAt(i - 1); }
    } else if (e.key === 'Backspace' && el.value === '' && i > 0) {
      e.preventDefault(); focusAt(i - 1);
    }
  }

  function handlePaste(e: ClipboardEvent) {
    const text = e.clipboardData?.getData('text').trim() ?? '';
    if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(text)) {
      e.preventDefault();
      octets = text.split('.').map(clampOctet) as [string, string, string, string];
      value = octets.join('.');
      dispatch('change', value);
      setTimeout(() => focusAt(3), 0);
    }
  }
</script>

<div class="ip-input-wrapper {className}">
  {#if label}
    <label for="{uid}-0" class="ip-input__label">{label}</label>
  {/if}
  <div class="ip-input{disabled ? ' ip-input--disabled' : ''}" role="group" aria-label={label ?? 'IP address'}>
    {#each octets as oct, i}
      <input
        bind:this={inputs[i]}
        id={i === 0 ? `${uid}-0` : undefined}
        type="text"
        inputmode="numeric"
        pattern="[0-9]*"
        role="spinbutton"
        aria-label="Octet {i + 1} of 4"
        aria-valuenow={oct === '' ? 0 : Number(oct)}
        aria-valuemin={0}
        aria-valuemax={255}
        value={oct}
        {disabled}
        maxlength={3}
        class="ip-input__octet"
        on:input={(e) => commitOctet(i, e.currentTarget.value)}
        on:keydown={(e) => handleKey(i, e)}
        on:paste={handlePaste}
        on:focus={(e) => e.currentTarget.select()}
      />
      {#if i < 3}
        <span class="ip-input__dot" aria-hidden="true">.</span>
      {/if}
    {/each}
  </div>
</div>
