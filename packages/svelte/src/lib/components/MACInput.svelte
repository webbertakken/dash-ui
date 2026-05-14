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
    value = $bindable('00:00:00:00:00:00'),
    disabled = false,
    class: className = '',
    onchange,
  }: Props = $props();
  const uid = `dash-ui-mac-${++counter}`;

  const HEX_RE = /^[0-9a-fA-F]{0,2}$/;
  const FULL_MAC_RE = /^([0-9a-fA-F]{2}[:\-]){5}[0-9a-fA-F]{2}$/;

  function parseMAC(mac: string): [string, string, string, string, string, string] {
    const parts = mac.replace(/-/g, ':').split(':');
    return [
      parts[0] ?? '00', parts[1] ?? '00', parts[2] ?? '00',
      parts[3] ?? '00', parts[4] ?? '00', parts[5] ?? '00',
    ];
  }

  let pairs: [string, string, string, string, string, string] = $state(parseMAC(value));
  let inputs: (HTMLInputElement | null)[] = $state([null, null, null, null, null, null]);

  function focusAt(i: number) {
    const el = inputs[i];
    if (el) { el.focus(); el.select(); }
  }

  function commitPair(i: number, raw: string) {
    if (!HEX_RE.test(raw)) return;
    pairs[i] = raw.toUpperCase();
    pairs = pairs as [string, string, string, string, string, string];
    value = pairs.join(':');
    onchange?.(value);
    if (raw.length === 2 && i < 5) setTimeout(() => focusAt(i + 1), 0);
  }

  function handleKey(i: number, e: KeyboardEvent) {
    const el = inputs[i]!;
    if (e.key === ':' || e.key === '-') {
      e.preventDefault();
      if (i < 5) focusAt(i + 1);
    } else if (e.key === 'ArrowRight' && el.selectionStart === el.value.length) {
      if (i < 5) { e.preventDefault(); focusAt(i + 1); }
    } else if (e.key === 'ArrowLeft' && el.selectionStart === 0) {
      if (i > 0) { e.preventDefault(); focusAt(i - 1); }
    } else if (e.key === 'Backspace' && el.value === '' && i > 0) {
      e.preventDefault(); focusAt(i - 1);
    }
  }

  function handlePaste(e: ClipboardEvent) {
    const text = e.clipboardData?.getData('text').trim() ?? '';
    if (FULL_MAC_RE.test(text)) {
      e.preventDefault();
      const normalized = text.replace(/-/g, ':').replace(/:/g, '').match(/.{1,2}/g)?.join(':') ?? text;
      pairs = normalized.split(':').map((p) => p.toUpperCase()) as [string, string, string, string, string, string];
      value = pairs.join(':');
      onchange?.(value);
      setTimeout(() => focusAt(5), 0);
    }
  }

  const PAIR_CLS =
    'w-6 border-0 bg-transparent p-0 text-center font-mono text-13 uppercase text-white outline-none';
</script>

<div class={className}>
  {#if label}
    <label for="{uid}-0" class="text-12 text-[#6e7079]">{label}</label>
  {/if}
  <div
    role="group"
    aria-label={label ?? 'MAC address'}
    data-disabled={disabled ? 'true' : undefined}
    class="inline-flex h-[34px] items-center gap-0.5 rounded-md border border-white/10 bg-[#0a0a0b] px-2 transition-colors duration-100 focus-within:border-brand-05 data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-40"
  >
    {#each pairs as pair, i}
      <input
        bind:this={inputs[i]}
        id={i === 0 ? `${uid}-0` : undefined}
        type="text"
        inputmode="text"
        aria-label={`Byte ${i + 1} of 6`}
        value={pair}
        {disabled}
        maxlength={2}
        class={PAIR_CLS}
        oninput={(e) => commitPair(i, e.currentTarget.value)}
        onkeydown={(e) => handleKey(i, e)}
        onpaste={handlePaste}
        onfocus={(e) => e.currentTarget.select()}
      />
      {#if i < 5}
        <span aria-hidden="true" class="select-none text-13 leading-none text-[#6e7079]">:</span>
      {/if}
    {/each}
  </div>
</div>
