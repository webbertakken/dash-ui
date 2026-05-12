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
    onclick,
    children,
  }: Props = $props();
</script>

<button
  {type}
  {title}
  aria-label={ariaLabel}
  {onclick}
  class="btn btn-{variant} {iconOnly ? 'btn-icon' : ''} {className}"
  {style}
  disabled={disabled || loading}
  aria-busy={loading ? true : undefined}
>
  {#if loading}<Spinner size="sm" />{/if}
  {@render children?.()}
</button>
