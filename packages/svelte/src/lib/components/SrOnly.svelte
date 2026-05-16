<script lang="ts">
  interface Props {
    class?: string;
    children?: import('svelte').Snippet;
  }

  let { class: className = '', children }: Props = $props();
</script>

<!--
  Visually-hidden text that stays available to assistive tech. Renders a
  <span class="sr-only"> so the .sr-only rule in @w5-ui/tokens/dashboard.css
  clips it from the visual layout while keeping it announceable by screen
  readers. Use it to name regions that the design intentionally leaves
  unlabelled, the way the reference Tables recipe wires
  <caption class="sr-only"> onto every <table> (WCAG 1.3.1). Typed equivalent
  of <span class="sr-only"> (apply the class directly to a <caption> /
  <label> when the whole element is the hidden text, or wrap an inline
  phrase with <SrOnly> when it sits alongside visible markup).
-->
<span class="sr-only {className}">
  {@render children?.()}
</span>
