<script lang="ts">
  interface Props {
    options?: { value: string; label: string; disabled?: boolean }[];
    value?: string[];
    ariaLabel?: string;
    size?: 'sm' | 'md';
    class?: string;
    onchange?: (payload: string[]) => void;
  }

  let {
    options = [],
    value = $bindable([]),
    ariaLabel = '',
    size = 'md',
    class: klass = '',
    onchange,
  }: Props = $props();

  function toggle(v: string) {
    const next = value.includes(v) ? value.filter((x) => x !== v) : [...value, v];
    value = next;
    onchange?.(next);
  }

  // Pre-composed size strings — Tailwind's static scanner must see literals.
  const SIZE: Record<NonNullable<Props['size']>, string> = {
    sm: 'h-6 px-[9px] text-11',
    md: 'h-7 px-3 text-12',
  };
</script>

<div
  role="group"
  aria-label={ariaLabel}
  class="inline-flex flex-wrap gap-px rounded-lg bg-row-hover p-0.5 {klass}"
>
  {#each options as opt}
    {@const on = value.includes(opt.value)}
    <button
      type="button"
      aria-pressed={on}
      disabled={opt.disabled}
      class="flex-shrink-0 grow-0 inline-flex cursor-pointer select-none items-center justify-center whitespace-nowrap rounded-md border-0 bg-transparent font-medium leading-none text-text-3 transition-[background-color,color] duration-100 hover:bg-row-hover hover:text-text-1 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-brand-05 {SIZE[size]} {on ? 'bg-bg-3 text-text-1 shadow-[0_1px_3px_rgba(0,0,0,0.18)] dark:shadow-[0_1px_3px_rgba(0,0,0,0.4)]' : ''}"
      onclick={() => toggle(opt.value)}
    >
      {opt.label}
    </button>
  {/each}
</div>
