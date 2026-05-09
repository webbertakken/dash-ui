<script lang="ts">
  let className = '';
  export { className as class };
  export let size: number = 16;
  export let style: string = '';
</script>
<svg width={size} height={size} viewBox="0 0 16 16" fill="none" class={className} {style}>
  <circle cx="7" cy="7" r="4.5" stroke="currentColor" stroke-width="1.5" />
  <path d="m10.5 10.5 3 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
</svg>
