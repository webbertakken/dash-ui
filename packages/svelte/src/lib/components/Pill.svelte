<script lang="ts">
  
  interface Props {
    variant?: 'success' | 'warn' | 'danger' | 'info' | 'neutral';
    showDot?: boolean;
    class?: string;
    style?: string;
    children?: import('svelte').Snippet;
  }

  let {
    variant = 'neutral',
    showDot = true,
    class: className = '',
    style = '',
    children
  }: Props = $props();
</script>

<span class="pill pill-{variant} {className}" {style}>
  {#if showDot}<span class="dot" aria-hidden="true"></span>{/if}
  {@render children?.()}
</span>
