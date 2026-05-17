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
    horizontal = false,
  }: Props = $props();

  // svelte-ignore state_referenced_locally
  const groupName = name ?? `dash-ui-rg-${++counter}`;

  // Native radio input drawn with Tailwind utilities. The selected dot is
  // an inline-SVG bg-image (matches the legacy checkbox approach).
  const DOT_SVG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 16 16' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='8' cy='8' r='3' fill='%23fff'/%3E%3C/svg%3E")`;

  const INPUT_CLS =
    'mt-px relative inline-block h-4 w-4 min-w-4 shrink-0 cursor-pointer appearance-none rounded-full border-[1.5px] border-border-3 bg-bg-1 align-middle bg-center bg-no-repeat transition-[border-color,background-color] duration-100 hover:border-text-3 checked:border-brand-05 checked:bg-brand-05 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-05';

  // Horizontal layout uses flex-wrap row gap; vertical stacks the options.
  let groupCls = $derived(
    horizontal ? 'flex flex-wrap gap-x-5 gap-y-1 border-0 m-0 p-0' : 'flex flex-col border-0 m-0 p-0',
  );
</script>

<fieldset class={groupCls}>
  <legend class={srOnlyLegend ? 'sr-only' : 'block p-0 mb-2 text-12 text-text-3'}>{legend}</legend>
  {#each options as opt}
    {@const optId = `${groupName}-${opt.value}`}
    <label
      for={optId}
      class="flex cursor-pointer select-none items-start gap-2 py-1.5 text-13 text-text-2 {opt.disabled
        ? 'cursor-not-allowed opacity-40'
        : ''}"
    >
      <input
        type="radio"
        id={optId}
        name={groupName}
        value={opt.value}
        checked={value === opt.value}
        disabled={opt.disabled}
        class={INPUT_CLS}
        style={value === opt.value ? `background-image: ${DOT_SVG};` : ''}
        onchange={() => { value = opt.value; }}
      />
      <span class="flex flex-col gap-px">
        <span>{opt.label}</span>
        {#if opt.description}
          <span class="text-12 text-text-3">{opt.description}</span>
        {/if}
      </span>
    </label>
  {/each}
</fieldset>
