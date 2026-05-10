<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  export let label: string | undefined = undefined;
  export let value: number = 0;
  export let min: number = 0;
  export let max: number = 100;
  export let step: number = 1;
  export let suffix: string | undefined = undefined;
  export let disabled: boolean = false;
  export let id: string | undefined = undefined;

  let counter = 0;
  const inputId = id ?? `slider-${counter++}`;
  const dispatch = createEventDispatcher<{ change: number }>();

  $: pct = max === min ? 0 : ((value - min) / (max - min)) * 100;

  function handleChange(e: Event) {
    value = Number((e.target as HTMLInputElement).value);
    dispatch('change', value);
  }
</script>

<div class="slider">
  {#if label}
    <div class="slider__header">
      <label for={inputId} class="slider__label">{label}</label>
      <span class="slider__value" aria-live="polite">
        {value}{#if suffix}<span class="slider__suffix">{suffix}</span>{/if}
      </span>
    </div>
  {/if}
  <input
    {id}
    type="range"
    class="slider__track"
    {min}
    {max}
    {step}
    {value}
    {disabled}
    style="--slider-fill:{pct}%"
    aria-label={label}
    aria-valuetext={suffix ? `${value} ${suffix}` : undefined}
    on:input={handleChange}
  />
</div>
