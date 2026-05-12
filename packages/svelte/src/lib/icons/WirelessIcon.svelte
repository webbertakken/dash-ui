<script lang="ts">
  interface Props { size?: number }
  let { size = 16 }: Props = $props();
</script>
<svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true" focusable="false">
  <path d="M2 11s1.5-1 6-1 6 1 6 1M2 8s1.5-1.5 6-1.5 6 1.5 6 1.5M2 5s1.5-2 6-2 6 2 6 2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
</svg>
