<script lang="ts">
  export let variant: 'text' | 'title' | 'stat' | 'circle' | 'block' = 'text';
  export let width: string | number | undefined = undefined;
  export let height: string | number | undefined = undefined;
  let className = '';
  export { className as class };
  export let ariaLabel: string = 'Loading';

  $: variantClass = variant === 'block' ? '' : variant;
  $: w = width ?? (variant === 'circle' ? height : undefined);
  $: style = [
    w !== undefined ? `width:${typeof w === 'number' ? w + 'px' : w}` : '',
    height !== undefined ? `height:${typeof height === 'number' ? height + 'px' : height}` : '',
  ].filter(Boolean).join(';');
</script>

<span
  class="skeleton {variantClass} {className}"
  {style}
  role="status"
  aria-label={ariaLabel}
  aria-busy="true"
></span>
