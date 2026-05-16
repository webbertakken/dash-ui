<script lang="ts">
  interface Props {
    dir: 'up' | 'down' | 'flat';
    class?: string;
    children?: import('svelte').Snippet;
  }

  let { dir, class: className = '', children }: Props = $props();

  let deltaClass = $derived(dir === 'flat' ? '' : `delta-${dir}`);
  let merged = $derived(`${deltaClass} ${className}`.trim());
</script>

<!--
  Trend indicator span used inside <Submeta> or any inline copy where a delta
  needs to be colour-coded (success when up, danger when down, neutral when
  flat). Emits a visually-hidden "Trend: " prefix so screen readers announce
  the direction independent of any arrow glyph supplied by the caller. Typed
  equivalent of `<span class="delta-up | delta-down">` from
  @w5-ui/tokens/dashboard.css.
-->
<span class="sr-only">Trend: </span>
<span class={merged || undefined}>
  {@render children?.()}
</span>
