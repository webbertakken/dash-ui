<script module lang="ts">
  let counter = 0;
</script>

<script lang="ts">
  interface Props {
    label: string;
    placement?: 'top' | 'bottom' | 'left' | 'right';
    class?: string;
    children?: import('svelte').Snippet;
  }

  let {
    label,
    placement = 'top',
    class: className = '',
    children
  }: Props = $props();
  
  const id = `dash-ui-tooltip-${++counter}`;
</script>

<span class="tooltip-wrapper tooltip-{placement} {className}">
  <span class="tooltip-trigger" aria-describedby={id}>{@render children?.()}</span>
  <span {id} role="tooltip" class="tooltip-content">{label}</span>
</span>
