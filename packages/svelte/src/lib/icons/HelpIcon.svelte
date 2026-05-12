<script lang="ts">
  interface Props { size?: number }
  let { size = 16 }: Props = $props();
</script>
<svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true" focusable="false">
  <circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="1.5" />
  <path d="M6.4 6.2c.2-1 1-1.5 1.9-1.5 1.1 0 1.9.7 1.9 1.7s-.6 1.4-1.4 1.8c-.6.3-1 .6-1 1.2v.3M8 11.6h0" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
</svg>
