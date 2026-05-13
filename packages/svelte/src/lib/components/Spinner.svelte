<script lang="ts">
  interface Props {
    size?: 'sm' | 'md' | 'lg';
    label?: string;
  }

  let { size = 'md', label = 'Loading' }: Props = $props();

  // Pre-compose so Tailwind's scanner picks up every variant. Tailwind's
  // `animate-spin` is `animation: spin 1s linear infinite` (rotate 360deg);
  // dashboard.css used 0.65s — we mirror that with arbitrary-value
  // `[animation-duration:0.65s]` to stay pixel-equivalent.
  const SIZE: Record<NonNullable<Props['size']>, string> = {
    sm: 'h-2.5 w-2.5 border-[1.5px]',
    md: 'h-3.5 w-3.5 border-2',
    lg: 'h-5 w-5 border-2',
  };
</script>

<span
  role="status"
  aria-label={label}
  class="inline-block shrink-0 animate-spin rounded-full border-white/18 border-t-current [animation-duration:0.65s] motion-reduce:[animation-duration:10s]
    {SIZE[size]}"
></span>
