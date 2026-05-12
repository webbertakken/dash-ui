<script lang="ts">
  interface Props { size?: number }
  let { size = 16 }: Props = $props();
</script>
<svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true" focusable="false">
  <rect x="3" y="2.5" width="10" height="11" rx="1.5" stroke="currentColor" stroke-width="1.5" />
  <line x1="5.5" y1="6" x2="10.5" y2="6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
  <line x1="5.5" y1="9" x2="10.5" y2="9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
</svg>
