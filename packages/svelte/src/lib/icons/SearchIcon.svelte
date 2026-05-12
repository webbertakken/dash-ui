<script lang="ts">
  interface Props {
    class?: string;
    size?: number;
    style?: string;
  }
  let { class: className = '', size = 16, style = '' }: Props = $props();
</script>
<svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true" focusable="false" class={className} {style}>
  <circle cx="7" cy="7" r="4.5" stroke="currentColor" stroke-width="1.5" />
  <path d="m10.5 10.5 3 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
</svg>
