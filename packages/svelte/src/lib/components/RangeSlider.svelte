<script lang="ts">
  interface Props {
    label?: string | undefined;
    min?: number;
    max?: number;
    step?: number;
    low?: number;
    high?: number;
    suffix?: string | undefined;
    disabled?: boolean;
    onchange?: (payload: [number, number]) => void;
  }

  let {
    label = undefined,
    min = 0,
    max = 100,
    step = 1,
    low = $bindable(0),
    high = $bindable(100),
    suffix = undefined,
    disabled = false,
    onchange,
  }: Props = $props();
  let lowPct = $derived(max === min ? 0 : ((low - min) / (max - min)) * 100);
  let highPct = $derived(max === min ? 0 : ((high - min) / (max - min)) * 100);
  let lowOnTop = $derived(low >= max - step);

  function handleLow(e: Event) {
    low = Math.min(Number((e.target as HTMLInputElement).value), high - step);
    onchange?.([low, high]);
  }

  function handleHigh(e: Event) {
    high = Math.max(Number((e.target as HTMLInputElement).value), low + step);
    onchange?.([low, high]);
  }

  // Native dual-thumb range slider. Both `<input type="range">` overlap
  // visually; we toggle z-index so the focused one is on top.
  const INPUT_CLS =
    'pointer-events-auto absolute inset-x-0 top-0 m-0 h-4 w-full cursor-pointer appearance-none bg-transparent outline-none [&::-webkit-slider-thumb]:[-webkit-appearance:none] [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-brand-05 [&::-webkit-slider-thumb]:bg-white [&::-moz-range-thumb]:h-3.5 [&::-moz-range-thumb]:w-3.5 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-brand-05 [&::-moz-range-thumb]:bg-white';
</script>

<div class="flex flex-col gap-1.5">
  {#if label}
    <div class="flex items-center justify-between gap-2">
      <span class="text-12 text-[#6e7079]">{label}</span>
      <span class="text-12 font-medium text-white tabular-nums" aria-live="polite">{low}{suffix ?? ''} &ndash; {high}{suffix ?? ''}</span>
    </div>
  {/if}
  <div
    class="relative h-4"
    role="group"
    aria-label={label}
  >
    <div class="absolute left-0 right-0 top-1/2 h-1 -translate-y-1/2 rounded-sm bg-white/[0.12]"></div>
    <div
      class="absolute top-1/2 h-1 -translate-y-1/2 rounded-sm bg-brand-05"
      style="left:{lowPct}%; right:{100 - highPct}%"
    ></div>
    <input
      type="range"
      class={INPUT_CLS}
      {min} {max} {step}
      value={low}
      {disabled}
      style="z-index:{lowOnTop ? 2 : 1}"
      aria-label={label ? `${label} minimum` : 'Minimum'}
      aria-valuetext={suffix ? `${low}${suffix}` : String(low)}
      oninput={handleLow}
    />
    <input
      type="range"
      class={INPUT_CLS}
      {min} {max} {step}
      value={high}
      {disabled}
      style="z-index:{lowOnTop ? 1 : 2}"
      aria-label={label ? `${label} maximum` : 'Maximum'}
      aria-valuetext={suffix ? `${high}${suffix}` : String(high)}
      oninput={handleHigh}
    />
  </div>
</div>
