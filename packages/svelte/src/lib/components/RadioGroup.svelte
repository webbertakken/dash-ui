<script module lang="ts">
  let counter = 0;
  export interface RadioOption {
    value: string;
    label: string;
    description?: string;
    disabled?: boolean;
  }
</script>

<script lang="ts">
  interface Props {
    legend: string;
    name?: string | undefined;
    options?: RadioOption[];
    value?: string | undefined;
    srOnlyLegend?: boolean;
    horizontal?: boolean;
  }

  let {
    legend,
    name = undefined,
    options = [],
    value = $bindable(undefined),
    srOnlyLegend = false,
    horizontal = false
  }: Props = $props();

  // svelte-ignore state_referenced_locally
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
        onchange={() => { value = opt.value; }}
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
