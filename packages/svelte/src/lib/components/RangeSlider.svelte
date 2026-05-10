<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  export let label: string | undefined = undefined;
  export let min = 0;
  export let max = 100;
  export let step = 1;
  export let low = 0;
  export let high = 100;
  export let suffix: string | undefined = undefined;
  export let disabled = false;

  const dispatch = createEventDispatcher<{ change: [number, number] }>();

  $: lowPct = max === min ? 0 : ((low - min) / (max - min)) * 100;
  $: highPct = max === min ? 0 : ((high - min) / (max - min)) * 100;
  $: lowOnTop = low >= max - step;

  function handleLow(e: Event) {
    low = Math.min(Number((e.target as HTMLInputElement).value), high - step);
    dispatch('change', [low, high]);
  }

  function handleHigh(e: Event) {
    high = Math.max(Number((e.target as HTMLInputElement).value), low + step);
    dispatch('change', [low, high]);
  }
</script>

<div class="range-slider">
  {#if label}
    <div class="range-slider__header">
      <span class="range-slider__label">{label}</span>
      <span class="range-slider__value" aria-live="polite">{low}{suffix ?? ''} &ndash; {high}{suffix ?? ''}</span>
    </div>
  {/if}
  <div
    class="range-slider__wrap"
    style="--rs-low:{lowPct}%;--rs-high:{highPct}%"
    role="group"
    aria-label={label}
  >
    <div class="range-slider__track-bg"></div>
    <div class="range-slider__fill"></div>
    <input
      type="range"
      class="range-slider__input"
      {min} {max} {step}
      value={low}
      {disabled}
      style="z-index:{lowOnTop ? 2 : 1}"
      aria-label={label ? `${label} minimum` : 'Minimum'}
      aria-valuetext={suffix ? `${low}${suffix}` : String(low)}
      on:input={handleLow}
    />
    <input
      type="range"
      class="range-slider__input"
      {min} {max} {step}
      value={high}
      {disabled}
      style="z-index:{lowOnTop ? 1 : 2}"
      aria-label={label ? `${label} maximum` : 'Maximum'}
      aria-valuetext={suffix ? `${high}${suffix}` : String(high)}
      on:input={handleHigh}
    />
  </div>
</div>
