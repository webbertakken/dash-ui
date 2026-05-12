<script lang="ts">
  interface Props { size?: number }
  let { size = 16 }: Props = $props();
</script>
<svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true" focusable="false">
  <rect x="2" y="2" width="5" height="5" rx="1" stroke="currentColor" stroke-width="1.5" />
  <rect x="9" y="2" width="5" height="5" rx="1" stroke="currentColor" stroke-width="1.5" />
  <rect x="2" y="9" width="5" height="5" rx="1" stroke="currentColor" stroke-width="1.5" />
  <rect x="9" y="9" width="5" height="5" rx="1" stroke="currentColor" stroke-width="1.5" />
</svg>
