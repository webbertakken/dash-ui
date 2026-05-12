<script lang="ts">
  interface Props { size?: number }
  let { size = 16 }: Props = $props();
</script>
<svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true" focusable="false">
  <rect x="2" y="5" width="12" height="6" rx="1" stroke="currentColor" stroke-width="1.5" />
  <line x1="5" y1="11" x2="5" y2="13" stroke="currentColor" stroke-width="1.5" />
  <line x1="11" y1="11" x2="11" y2="13" stroke="currentColor" stroke-width="1.5" />
</svg>
