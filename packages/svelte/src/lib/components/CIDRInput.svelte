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
    value = $bindable('0.0.0.0/0'),
    disabled = false,
    class: className = '',
    onchange,
  }: Props = $props();
  const uid = `dash-ui-cidr-${++counter}`;

  function clampOctet(s: string): string {
    if (s === '') return s;
    const n = Number(s);
    if (isNaN(n)) return s;
    return String(Math.min(255, Math.max(0, n)));
  }

  function clampPrefix(s: string): string {
    if (s === '') return s;
    const n = Number(s);
    if (isNaN(n)) return s;
    return String(Math.min(32, Math.max(0, n)));
  }

  function parseCIDR(cidr: string): [string, string, string, string, string] {
    const [ip = '0.0.0.0', prefix = '24'] = cidr.split('/');
    const parts = ip.split('.');
    return [parts[0] ?? '0', parts[1] ?? '0', parts[2] ?? '0', parts[3] ?? '0', prefix];
  }

  let fields: [string, string, string, string, string] = $state(parseCIDR(value));
  let inputs: (HTMLInputElement | null)[] = $state([null, null, null, null, null]);

  function focusAt(i: number) {
    const el = inputs[i];
    if (el) { el.focus(); el.select(); }
  }

  function commitFields() {
    value = `${fields.slice(0, 4).join('.')}/${fields[4]}`;
    onchange?.(value);
  }

  function commitOctet(i: number, raw: string) {
    if (!/^\d{0,3}$/.test(raw)) return;
    fields[i] = clampOctet(raw);
    fields = fields as [string, string, string, string, string];
    commitFields();
    if (raw.length === 3 && i < 4) setTimeout(() => focusAt(i + 1), 0);
  }

  function commitPrefix(raw: string) {
    if (!/^\d{0,2}$/.test(raw)) return;
    fields[4] = clampPrefix(raw);
    fields = fields as [string, string, string, string, string];
    commitFields();
  }

  function handleKey(i: number, e: KeyboardEvent) {
    const el = inputs[i]!;
    if (e.key === '.' && i < 3) {
      e.preventDefault();
      focusAt(i + 1);
    } else if (e.key === '/' && i <= 3) {
      e.preventDefault();
      focusAt(4);
    } else if (e.key === 'ArrowRight' && el.selectionStart === el.value.length) {
      if (i < 4) { e.preventDefault(); focusAt(i + 1); }
    } else if (e.key === 'ArrowLeft' && el.selectionStart === 0) {
      if (i > 0) { e.preventDefault(); focusAt(i - 1); }
    } else if (e.key === 'Backspace' && el.value === '' && i > 0) {
      e.preventDefault(); focusAt(i - 1);
    }
  }

  function handlePaste(e: ClipboardEvent) {
    const text = e.clipboardData?.getData('text').trim() ?? '';
    if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\/\d{1,2}$/.test(text)) {
      e.preventDefault();
      const [ip = '0.0.0.0', prefix = '0'] = text.split('/');
      fields = [...ip.split('.').map(clampOctet), clampPrefix(prefix)] as [string, string, string, string, string];
      commitFields();
      setTimeout(() => focusAt(4), 0);
    }
  }
</script>

<div class="cidr-input-wrapper {className}">
  {#if label}
    <label for="{uid}-0" class="cidr-input__label">{label}</label>
  {/if}
  <div class="cidr-input{disabled ? ' cidr-input--disabled' : ''}" role="group" aria-label={label ?? 'CIDR'}>
    {#each [0, 1, 2, 3] as i (i)}
      <input
        bind:this={inputs[i]}
        id={i === 0 ? `${uid}-0` : undefined}
        type="text"
        inputmode="numeric"
        pattern="[0-9]*"
        role="spinbutton"
        aria-label="Octet {i + 1} of 4"
        aria-valuenow={fields[i] === '' ? 0 : Number(fields[i])}
        aria-valuemin={0}
        aria-valuemax={255}
        value={fields[i]}
        {disabled}
        maxlength={3}
        class="cidr-input__octet"
        oninput={(e) => commitOctet(i, e.currentTarget.value)}
        onkeydown={(e) => handleKey(i, e)}
        onpaste={handlePaste}
        onfocus={(e) => e.currentTarget.select()}
      />
      <span class="cidr-input__dot" aria-hidden="true">{i < 3 ? '.' : '/'}</span>
    {/each}
    <input
      bind:this={inputs[4]}
      type="text"
      inputmode="numeric"
      pattern="[0-9]*"
      role="spinbutton"
      aria-label="Prefix length"
      aria-valuenow={fields[4] === '' ? 0 : Number(fields[4])}
      aria-valuemin={0}
      aria-valuemax={32}
      value={fields[4]}
      {disabled}
      maxlength={2}
      class="cidr-input__prefix"
      oninput={(e) => commitPrefix(e.currentTarget.value)}
      onkeydown={(e) => handleKey(4, e)}
      onpaste={handlePaste}
      onfocus={(e) => e.currentTarget.select()}
    />
  </div>
</div>
