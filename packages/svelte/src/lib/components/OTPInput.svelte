<script module lang="ts">
  let counter = 0;
</script>

<script lang="ts">
  interface Props {
    label?: string | undefined;
    length?: number;
    value?: string;
    disabled?: boolean;
    class?: string;
    onchange?: (payload: string) => void;
  }

  let {
    label = undefined,
    length = 6,
    value = $bindable(''),
    disabled = false,
    class: className = '',
    onchange,
  }: Props = $props();
  const uid = `dash-ui-otp-${++counter}`;

  // svelte-ignore state_referenced_locally
  let digits: string[] = $state(Array.from({ length }, (_, i) => value[i] ?? ''));
  // svelte-ignore state_referenced_locally
  let inputs: (HTMLInputElement | null)[] = $state(Array(length).fill(null));

  // svelte-ignore state_referenced_locally
  const half = Math.floor(length / 2);

  function focusAt(i: number) {
    const el = inputs[i];
    if (el) { el.focus(); el.select(); }
  }

  function commit(next: string[]) {
    digits = next;
    value = next.join('');
    onchange?.(value);
  }

  function handleInput(i: number, raw: string) {
    const char = raw.replace(/\D/g, '').slice(-1);
    const next = [...digits];
    next[i] = char;
    commit(next);
    if (char && i < length - 1) setTimeout(() => focusAt(i + 1), 0);
  }

  function handleKey(i: number, e: KeyboardEvent) {
    if (e.key === 'Backspace') {
      if (digits[i]) {
        const next = [...digits]; next[i] = ''; commit(next);
      } else if (i > 0) {
        e.preventDefault(); focusAt(i - 1);
      }
    } else if (e.key === 'ArrowLeft' && i > 0) {
      e.preventDefault(); focusAt(i - 1);
    } else if (e.key === 'ArrowRight' && i < length - 1) {
      e.preventDefault(); focusAt(i + 1);
    }
  }

  function handlePaste(e: ClipboardEvent) {
    const text = (e.clipboardData?.getData('text') ?? '').replace(/\D/g, '').slice(0, length);
    if (!text.length) return;
    e.preventDefault();
    const next = Array.from({ length }, (_, i) => text[i] ?? digits[i] ?? '');
    commit(next);
    setTimeout(() => focusAt(Math.min(text.length, length - 1)), 0);
  }

  const DIGIT_CLS =
    'h-9 w-9 rounded-md border border-white/10 bg-[#0a0a0b] text-center font-mono text-15 text-white outline-none transition-colors duration-100 focus:border-brand-05 focus:shadow-[0_0_0_2px_rgba(0,111,255,0.2)]';
</script>

<div class={className}>
  {#if label}
    <label for="{uid}-0" class="text-12 text-[#6e7079]">{label}</label>
  {/if}
  <div
    role="group"
    aria-label={label ?? 'One-time password'}
    data-disabled={disabled ? 'true' : undefined}
    class="inline-flex items-center gap-1.5 data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-40"
  >
    {#each digits as d, i}
      {#if i === half}
        <span aria-hidden="true" class="select-none text-13 text-[#6e7079]">&ndash;</span>
      {/if}
      <input
        bind:this={inputs[i]}
        id={i === 0 ? `${uid}-0` : undefined}
        type="text"
        inputmode="numeric"
        pattern="[0-9]*"
        maxlength={1}
        aria-label={`Digit ${i + 1} of ${length}`}
        value={d}
        {disabled}
        class={DIGIT_CLS}
        autocomplete={i === 0 ? 'one-time-code' : 'off'}
        oninput={(e) => handleInput(i, e.currentTarget.value)}
        onkeydown={(e) => handleKey(i, e)}
        onpaste={handlePaste}
        onfocus={(e) => e.currentTarget.select()}
      />
    {/each}
  </div>
</div>
