<script lang="ts">
  import { createBubbler } from 'svelte/legacy';

  const bubble = createBubbler();
  
  interface Props {
    title?: string | undefined;
    type?: 'button' | 'submit' | 'reset';
    class?: string;
    style?: string;
    children?: import('svelte').Snippet;
    [key: string]: any
  }

  let {
    title = undefined,
    type = 'button',
    class: className = '',
    style = '',
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
  aria-label={rest['aria-label'] ?? title}
  onclick={bubble('click')}
>
  {@render children?.()}
</button>
