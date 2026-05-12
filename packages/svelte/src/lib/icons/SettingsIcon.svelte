<script lang="ts">
  interface Props { size?: number }
  let { size = 16 }: Props = $props();
</script>
<svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true" focusable="false">
  <circle cx="8" cy="8" r="2.2" stroke="currentColor" stroke-width="1.5" />
  <path d="M8 1.5v1.6M8 12.9v1.6M14.5 8h-1.6M3.1 8H1.5m11-4.6-1.1 1.1M4.6 11.4l-1.1 1.1m0-9 1.1 1.1m6.7 6.7 1.1 1.1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
</svg>
