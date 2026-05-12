<script lang="ts">
  interface Props { size?: number }
  let { size = 16 }: Props = $props();
</script>
<svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true" focusable="false">
  <rect x="2.5" y="3.5" width="11" height="9" rx="1.5" stroke="currentColor" stroke-width="1.5" />
  <line x1="2.5" y1="6.5" x2="13.5" y2="6.5" stroke="currentColor" stroke-width="1.5" />
</svg>
