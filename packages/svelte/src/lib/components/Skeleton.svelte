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
    ariaLabel = 'Loading',
  }: Props = $props();

  let w = $derived(width ?? (variant === 'circle' ? height : undefined));
  let inlineStyle = $derived(
    [
      w !== undefined ? `width:${typeof w === 'number' ? w + 'px' : w}` : '',
      height !== undefined ? `height:${typeof height === 'number' ? height + 'px' : height}` : '',
    ]
      .filter(Boolean)
      .join(';'),
  );

  // Pre-composed variant strings so Tailwind's static scanner picks them up.
  // Mirrors the legacy `.skeleton.text/.title/.stat/.circle` ramp.
  const VARIANT: Record<NonNullable<Props['variant']>, string> = {
    text: 'h-3 rounded-[3px]',
    title: 'h-[18px] rounded',
    stat: 'h-7 rounded',
    circle: 'rounded-full',
    block: 'rounded',
  };
</script>

<span
  class="block animate-shimmer bg-[length:200%_100%] bg-[linear-gradient(90deg,rgba(255,255,255,0.04)_0%,rgba(255,255,255,0.1)_50%,rgba(255,255,255,0.04)_100%)] motion-reduce:animate-none {VARIANT[variant]} {className}"
  style={inlineStyle}
  role="status"
  aria-label={ariaLabel}
  aria-busy="true"
></span>
