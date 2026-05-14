<script module lang="ts">
  let counter = 0;
  export interface ColorSwatchDef {
    value: string;
    label: string;
    color: string;
  }
  export const COLOR_SWATCHES: ColorSwatchDef[] = [
    { value: 'blue', label: 'Blue', color: '#006FFF' },
    { value: 'green', label: 'Green', color: '#00B070' },
    { value: 'amber', label: 'Amber', color: '#F5A623' },
    { value: 'red', label: 'Red', color: '#F03A3A' },
    { value: 'purple', label: 'Purple', color: '#9B59B6' },
    { value: 'teal', label: 'Teal', color: '#1ABC9C' },
    { value: 'pink', label: 'Pink', color: '#E91E8C' },
    { value: 'orange', label: 'Orange', color: '#FF6B35' },
    { value: 'slate', label: 'Slate', color: '#6E7079' },
    { value: 'light', label: 'Light', color: '#E8E8EC' },
  ];
</script>

<script lang="ts">
  interface Props {
    label?: string;
    srOnlyLabel?: boolean;
    value?: string;
    swatches?: ColorSwatchDef[];
    disabled?: boolean;
    onChange?: ((v: string) => void) | undefined;
  }

  let {
    label = 'Colour',
    srOnlyLabel = false,
    value = $bindable(COLOR_SWATCHES[0].value),
    swatches = COLOR_SWATCHES,
    disabled = false,
    onChange = undefined,
  }: Props = $props();

  const groupId = `dash-ui-cp-${++counter}`;

  function handleKeyDown(e: KeyboardEvent) {
    const cells = Array.from(
      (e.currentTarget as HTMLElement).querySelectorAll<HTMLInputElement>('input[type="radio"]'),
    );
    if (!cells.length) return;
    const idx = cells.findIndex((c) => c.value === value);
    let next = idx;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = (idx + 1) % cells.length;
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = (idx - 1 + cells.length) % cells.length;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = cells.length - 1;
    else return;
    e.preventDefault();
    cells[next].focus();
    value = cells[next].value;
    onChange?.(value);
  }

  let hasMatch = $derived(swatches.some((s) => s.value === value));
</script>

<div
  data-disabled={disabled ? 'true' : undefined}
  class="inline-flex flex-col gap-1.5 data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-40"
>
  <div id="{groupId}-label" class={srOnlyLabel ? 'sr-only' : 'text-12 text-[#6e7079]'}>{label}</div>
  <div
    role="radiogroup"
    aria-labelledby="{groupId}-label"
    class="flex flex-wrap gap-1.5"
    tabindex={-1}
    onkeydown={handleKeyDown}
  >
    {#each swatches as sw, i}
      {@const checked = sw.value === value}
      {@const tabIdx = checked || (i === 0 && !hasMatch) ? 0 : -1}
      <label class="group/sw inline-flex cursor-pointer" title={sw.label}>
        <input
          type="radio"
          name={groupId}
          value={sw.value}
          {checked}
          {disabled}
          class="peer sr-only"
          tabindex={tabIdx}
          aria-label={sw.label}
          onchange={() => {
            value = sw.value;
            onChange?.(value);
          }}
        />
        <span
          class="inline-block h-5 w-5 rounded-full transition-[transform,box-shadow] duration-100 hover:scale-110 motion-reduce:hover:scale-100 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brand-05 {checked ? 'shadow-[0_0_0_2px_#0a0a0b,0_0_0_4px_#fff]' : ''}"
          style="background:{sw.color}"
          aria-hidden="true"
        ></span>
      </label>
    {/each}
  </div>
</div>
