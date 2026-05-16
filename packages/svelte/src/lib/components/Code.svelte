<script lang="ts">
  interface Props {
    class?: string;
    children?: import('svelte').Snippet;
  }

  let { class: className = '', children }: Props = $props();
</script>

<!--
  Inline code snippet for key names, config paths, environment variables
  and other short literal strings that read inside body copy. Renders a
  <code class="dash-ui-code"> so the .dash-ui-code rule in
  @w5-ui/tokens/css applies the canonical JetBrains Mono family, 12 px
  size, muted text colour, and the inset --depthBg-2 chip background
  with a 1 px border. Stops userland reaching for bare <code> (which
  falls back to a serif monospace on #fff) or inline font-family /
  background overrides on every snippet. Typed equivalent of
  <code class="dash-ui-code"> (reach for <CodeBlock> when the snippet
  wraps to multiple lines; this primitive is for the inline case).
-->
<code class="dash-ui-code {className}">
  {@render children?.()}
</code>
