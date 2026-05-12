<script lang="ts">
  interface Props { size?: number }
  let { size = 12 }: Props = $props();
</script>
<svg width={size} height={size} viewBox="0 0 12 12" fill="none" aria-hidden="true" focusable="false">
  <path d="M6 1.5v9M1.5 6h9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
</svg>
