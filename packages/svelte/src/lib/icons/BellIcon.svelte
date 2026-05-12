<script lang="ts">
  interface Props { size?: number }
  let { size = 16 }: Props = $props();
</script>
<svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true" focusable="false">
  <path d="M4 6.5a4 4 0 0 1 8 0V9l1.2 2H2.8L4 9V6.5ZM6.5 12.5a1.5 1.5 0 0 0 3 0" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
</svg>
