<script context="module" lang="ts">
  let counter = 0;
  export interface RadioOption {
    value: string;
    label: string;
    description?: string;
    disabled?: boolean;
  }
</script>

<script lang="ts">
  export let legend: string;
  export let name: string | undefined = undefined;
  export let options: RadioOption[] = [];
  export let value: string | undefined = undefined;
  export let srOnlyLegend: boolean = false;
  export let horizontal: boolean = false;

  const groupName = name ?? `dash-ui-rg-${++counter}`;
</script>

<fieldset class="radio-group {horizontal ? 'radio-group--h' : ''}">
  <legend class={srOnlyLegend ? 'sr-only' : 'radio-group__legend'}>{legend}</legend>
  {#each options as opt}
    {@const optId = `${groupName}-${opt.value}`}
    <label
      for={optId}
      class="radio-option{opt.disabled ? ' radio-option--disabled' : ''}"
    >
      <input
        type="radio"
        id={optId}
        name={groupName}
        value={opt.value}
        checked={value === opt.value}
        disabled={opt.disabled}
        class="radio"
        on:change={() => { value = opt.value; }}
      />
      <span class="radio-text">
        <span>{opt.label}</span>
        {#if opt.description}
          <span class="radio-description">{opt.description}</span>
        {/if}
      </span>
    </label>
  {/each}
</fieldset>
