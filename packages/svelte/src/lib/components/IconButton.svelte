<!--
  Icon-only button. Name it with `aria-label`, or wrap it in
  `<Tooltip label>`, which names an unlabelled icon button after the tooltip.
-->
<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    type?: 'button' | 'submit' | 'reset';
    class?: string;
    style?: string;
    onclick?: (event: MouseEvent) => void;
    children?: Snippet;
    [key: string]: unknown;
  }

  // svelte-ignore state_referenced_locally
  let {
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
  class="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-text-3 hover:bg-row-hover hover:text-text-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-05 {className}"
  {style}
  {...rest}
  {onclick}
>
  {@render children?.()}
</button>
