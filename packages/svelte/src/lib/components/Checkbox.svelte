<script module lang="ts">
  let counter = 0;
</script>

<script lang="ts">
  interface Props {
    checked?: boolean;
    indeterminate?: boolean;
    label?: string | undefined;
    id?: string | undefined;
    disabled?: boolean;
    onchange?: (event: Event) => void;
    [key: string]: unknown;
  }

  // svelte-ignore state_referenced_locally
  // svelte-ignore state_referenced_locally
  let {
    checked = false,
    indeterminate = false,
    label = undefined,
    id = undefined,
    disabled = false,
    onchange,
    ...rest
  }: Props = $props();

  const uid = `dash-ui-cb-${++counter}`;
  let inputId = $derived(id ?? uid);

  let el = $state<HTMLInputElement | undefined>(undefined);

  // Sync the imperative DOM properties to the reactive props. `$effect` reads
  // both `checked` and `indeterminate` so it re-runs whenever either flips.
  $effect(() => {
    if (el) {
      el.checked = checked;
      el.indeterminate = indeterminate;
    }
  });

  // The ✓ + indeterminate dash glyphs ship as inline SVG data URLs so the
  // checkbox stays a single `<input type="checkbox">` (no wrapping span,
  // native AT behaviour, native focus ring), with the marks drawn by
  // `background-image`. Tailwind v4 supports arbitrary-value `bg-[url(...)]`
  // but the SVG payload would have to live inline in a class string; we
  // keep these as `var(...)` references via a tiny inline style so the
  // class string stays scannable + the icons stay editable.
  const CHECK_SVG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 16 16' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M3 8.5l3 3 6.5-6' stroke='%23fff' stroke-width='1.75' stroke-linecap='round' stroke-linejoin='round' fill='none'/%3E%3C/svg%3E")`;
  const DASH_SVG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 16 16' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M4 8h8' stroke='%23fff' stroke-width='2' stroke-linecap='round' fill='none'/%3E%3C/svg%3E")`;

  // Compose the background image conditionally for the input style.
  let bgImage = $derived(indeterminate ? DASH_SVG : checked ? CHECK_SVG : 'none');

  const INPUT_CLS =
    'relative inline-block h-4 w-4 min-w-4 cursor-pointer appearance-none rounded-sm border-[1.5px] border-white/25 bg-[#141415] align-middle bg-[length:100%_100%] bg-center bg-no-repeat transition-[border-color,background-color] duration-100 hover:border-white/45 checked:border-brand-05 checked:bg-brand-05 indeterminate:border-brand-05 indeterminate:bg-brand-05 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-05';
</script>

{#if label}
  <label
    class="inline-flex cursor-pointer select-none items-center gap-2 text-13 text-[#c8c9d0] has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-40"
    for={inputId}
  >
    <input
      bind:this={el}
      type="checkbox"
      id={inputId}
      {disabled}
      class={INPUT_CLS}
      style="background-image: {bgImage};"
      {onchange}
      {...rest}
    />
    <span>{label}</span>
  </label>
{:else}
  <input
    bind:this={el}
    type="checkbox"
    id={inputId}
    {disabled}
    class={INPUT_CLS}
    style="background-image: {bgImage};"
    {onchange}
    {...rest}
  />
{/if}
