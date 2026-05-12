<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    title?: string | undefined;
    type?: 'button' | 'submit' | 'reset';
    class?: string;
    style?: string;
    onclick?: (event: MouseEvent) => void;
    children?: Snippet;
    [key: string]: unknown;
  }

  let {
    title = undefined,
    type = 'button',
    class: className = '',
    style = '',
    onclick,
    children,
    ...rest
  }: Props = $props();
</script>

<button
  {type}
  class="icon-btn {className}"
  {title}
  {style}
  {...rest}
  aria-label={(rest['aria-label'] as string | undefined) ?? title}
  {onclick}
>
  {@render children?.()}
</button>
