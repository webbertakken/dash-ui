<script lang="ts">
  export let variant: 'success' | 'warn' | 'danger' | 'info' | 'neutral' = 'neutral';
  export let showDot: boolean = true;
  let className = '';
  export { className as class };
  export let style: string = '';
</script>

<span class="pill pill-{variant} {className}" {style}>
  {#if showDot}<span class="dot" aria-hidden="true"></span>{/if}
  <slot />
</span>
