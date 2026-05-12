<script lang="ts">
  interface Props { size?: number }
  let { size = 16 }: Props = $props();
</script>
<svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true" focusable="false">
  <path d="M2 6c3-3 9-3 12 0M4 9c2.5-2.5 5.5-2.5 8 0" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
  <circle cx="8" cy="12" r="1" fill="currentColor" />
</svg>
