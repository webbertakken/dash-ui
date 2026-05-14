<script lang="ts">
  interface Props {
    label?: string | undefined;
    value?: number;
    min?: number;
    max?: number;
    step?: number;
    suffix?: string | undefined;
    disabled?: boolean;
    id?: string | undefined;
    onchange?: (payload: number) => void;
  }

  let {
    label = undefined,
    value = $bindable(0),
    min = 0,
    max = 100,
    step = 1,
    suffix = undefined,
    disabled = false,
    id = undefined,
    onchange,
  }: Props = $props();

  let counter = 0;
  // svelte-ignore state_referenced_locally
  const inputId = id ?? `slider-${counter++}`;
  let pct = $derived(max === min ? 0 : ((value - min) / (max - min)) * 100);

  function handleChange(e: Event) {
    value = Number((e.target as HTMLInputElement).value);
    onchange?.(value);
  }

  // The native <input type="range"> track gets a gradient-fill background
  // composed inline (so the fill % is reactive). Thumb chrome lives in
  // arbitrary-value pseudo-element utilities — Tailwind v4 handles them
  // statically.
  const TRACK_CLS =
    'h-1 w-full cursor-pointer appearance-none rounded-sm outline-none transition-opacity duration-100 disabled:cursor-not-allowed disabled:opacity-40 ' +
    '[&::-webkit-slider-thumb]:[-webkit-appearance:none] [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-brand-05 [&::-webkit-slider-thumb]:bg-white ' +
    '[&::-moz-range-thumb]:h-3.5 [&::-moz-range-thumb]:w-3.5 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-brand-05 [&::-moz-range-thumb]:bg-white';
</script>

<div class="flex flex-col gap-1.5">
  {#if label}
    <div class="flex items-center justify-between gap-2">
      <label for={inputId} class="text-12 text-[#6e7079]">{label}</label>
      <span class="flex items-baseline gap-px text-12 font-medium text-white tabular-nums" aria-live="polite">
        {value}{#if suffix}<span class="ml-px text-11 text-[#6e7079]">{suffix}</span>{/if}
      </span>
    </div>
  {/if}
  <input
    {id}
    type="range"
    class={TRACK_CLS}
    {min}
    {max}
    {step}
    {value}
    {disabled}
    style={`background: linear-gradient(to right, var(--brand-05) 0%, var(--brand-05) ${pct}%, rgba(255,255,255,0.12) ${pct}%, rgba(255,255,255,0.12) 100%);`}
    aria-label={label}
    aria-valuetext={suffix ? `${value} ${suffix}` : undefined}
    oninput={handleChange}
  />
</div>
