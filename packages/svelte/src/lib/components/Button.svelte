<script lang="ts">
  import type { Snippet } from 'svelte';
  import Spinner from './Spinner.svelte';

  interface Props {
    variant?: 'primary' | 'ghost' | 'danger';
    iconOnly?: boolean;
    loading?: boolean;
    title?: string | undefined;
    type?: 'button' | 'submit' | 'reset';
    disabled?: boolean;
    class?: string;
    style?: string;
    'aria-label'?: string | undefined;
    /** ARIA popup trigger: `'dialog'` for popover-style buttons that open
     * an inline calendar / picker; mirrors the React `<Button>` API and the
     * actual prop usage in DatePicker / DateRangePicker / TimeRange. */
    'aria-haspopup'?: 'dialog' | 'menu' | 'listbox' | 'tree' | 'grid' | boolean | undefined;
    /** Expanded state for popup triggers. */
    'aria-expanded'?: boolean | undefined;
    /** ID of the controlled popup/dialog. */
    'aria-controls'?: string | undefined;
    onclick?: (event: MouseEvent) => void;
    children?: Snippet;
  }

  let {
    variant = 'ghost',
    iconOnly = false,
    loading = false,
    title = undefined,
    type = 'button',
    disabled = false,
    class: className = '',
    style = '',
    'aria-label': ariaLabel = undefined,
    'aria-haspopup': ariaHasPopup = undefined,
    'aria-expanded': ariaExpanded = undefined,
    'aria-controls': ariaControls = undefined,
    onclick,
    children,
  }: Props = $props();

  // Pre-compose variant strings so Tailwind's static scanner picks them up.
  // Motif-aware:
  //   primary: brand-blue, always white text (works against blue in both motifs).
  //   ghost:   transparent surface with motif-aware text/border + hover.
  //   danger:  semantic status-danger text + faded border.
  const VARIANT: Record<NonNullable<Props['variant']>, string> = {
    primary: 'bg-brand-05 text-white hover:bg-brand-06 border-transparent',
    ghost:
      'bg-transparent text-text-2 border-border-2 hover:bg-row-hover hover:text-text-1',
    danger: 'bg-transparent text-status-danger border-status-danger/30',
  };
</script>

<button
  {type}
  {title}
  aria-label={ariaLabel}
  aria-haspopup={ariaHasPopup}
  aria-expanded={ariaExpanded}
  aria-controls={ariaControls}
  {onclick}
  class="inline-flex h-[30px] cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-md border px-3 text-13 font-medium transition-all duration-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-05 disabled:cursor-not-allowed disabled:opacity-55
    {VARIANT[variant]}
    {iconOnly ? 'w-[30px] justify-center p-0' : ''}
    {className}"
  {style}
  disabled={disabled || loading}
  aria-busy={loading ? true : undefined}
>
  {#if loading}<Spinner size="sm" />{/if}
  {@render children?.()}
</button>
