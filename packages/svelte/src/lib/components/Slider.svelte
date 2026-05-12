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
    oninput={handleChange}
  />
</div>
