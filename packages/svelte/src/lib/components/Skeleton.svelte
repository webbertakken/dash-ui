<script lang="ts">
  
  interface Props {
    variant?: 'text' | 'title' | 'stat' | 'circle' | 'block';
    width?: string | number | undefined;
    height?: string | number | undefined;
    class?: string;
    ariaLabel?: string;
  }

  let {
    variant = 'text',
    width = undefined,
    height = undefined,
    class: className = '',
    ariaLabel = 'Loading'
  }: Props = $props();

  let variantClass = $derived(variant === 'block' ? '' : variant);
  let w = $derived(width ?? (variant === 'circle' ? height : undefined));
  let style = $derived([
    w !== undefined ? `width:${typeof w === 'number' ? w + 'px' : w}` : '',
    height !== undefined ? `height:${typeof height === 'number' ? height + 'px' : height}` : '',
  ].filter(Boolean).join(';'));
</script>

<span
  class="skeleton {variantClass} {className}"
  {style}
  role="status"
  aria-label={ariaLabel}
  aria-busy="true"
></span>
