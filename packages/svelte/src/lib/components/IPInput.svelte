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
    value = $bindable('0.0.0.0'),
    disabled = false,
    class: className = '',
    onchange,
  }: Props = $props();
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

  let octets: [string, string, string, string] = $state(parseIP(value));
  let inputs: (HTMLInputElement | null)[] = $state([null, null, null, null]);

  function focusAt(i: number) {
    const el = inputs[i];
    if (el) { el.focus(); el.select(); }
  }

  function commitOctet(i: number, raw: string) {
    if (!/^\d{0,3}$/.test(raw)) return;
    octets[i] = clampOctet(raw);
    octets = octets as [string, string, string, string];
    value = octets.join('.');
    onchange?.(value);
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
      onchange?.(value);
      setTimeout(() => focusAt(3), 0);
    }
  }

  const OCTET_CLS =
    'w-9 border-0 bg-transparent p-0 text-center font-mono text-13 text-text-1 outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none';
</script>

<div class={className}>
  {#if label}
    <label for="{uid}-0" class="text-12 text-text-4">{label}</label>
  {/if}
  <div
    role="group"
    aria-label={label ?? 'IP address'}
    data-disabled={disabled ? 'true' : undefined}
    class="inline-flex h-[34px] items-center gap-0.5 rounded-md border border-border-2 bg-bg-page px-2 transition-colors duration-100 focus-within:border-brand-05 data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-40"
  >
    {#each octets as oct, i}
      <input
        bind:this={inputs[i]}
        id={i === 0 ? `${uid}-0` : undefined}
        type="text"
        inputmode="numeric"
        pattern="[0-9]*"
        role="spinbutton"
        aria-label={`Octet ${i + 1} of 4`}
        aria-valuenow={oct === '' ? 0 : Number(oct)}
        aria-valuemin={0}
        aria-valuemax={255}
        value={oct}
        {disabled}
        maxlength={3}
        class={OCTET_CLS}
        oninput={(e) => commitOctet(i, e.currentTarget.value)}
        onkeydown={(e) => handleKey(i, e)}
        onpaste={handlePaste}
        onfocus={(e) => e.currentTarget.select()}
      />
      {#if i < 3}
        <span aria-hidden="true" class="select-none text-13 leading-none text-text-4">.</span>
      {/if}
    {/each}
  </div>
</div>
