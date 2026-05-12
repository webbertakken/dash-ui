<script lang="ts">
  interface Props { size?: number }
  let { size = 14 }: Props = $props();
</script>
<svg width={size} height={size} viewBox="0 0 14 14" fill="none" aria-hidden="true" focusable="false">
  <path d="M7 1.5v7m0 0L4.5 6m2.5 2.5L9.5 6M2 11h10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
</svg>
