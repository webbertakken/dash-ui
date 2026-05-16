<script lang="ts">
  interface Props {
    class?: string;
    children?: import('svelte').Snippet;
  }

  let { class: className = '', children }: Props = $props();
</script>

<!--
  Display-2 - the 48 px / bold / --lh-tight / --tracking-display
  (-0.02em) rhythm used for login and large marketing surfaces (the
  step below the 64 px Display-1 hero). Renders
  <h1 class="dash-ui-display-2"> so the .dash-ui-display-2 rule in
  @w5-ui/tokens/tokens.css pins the canonical size, weight, line-
  height, letter-spacing, and --text-1 colour. Stops userland reaching
  for an ad-hoc <h1 style="font-size: 48px"> that almost always
  forgets --lh-tight (1.1) and the negative tracking, which is the
  documented "headings break awkwardly across two lines" drift in
  Foundations / Type. Typed equivalent of <h1 class="dash-ui-display-2">
  (the userland-facing semantic class documented in Foundations /
  Type). Use for login-page titles or large marketing heroes one step
  down from <Display1>. In-app pages should reach for <PageHeader>
  (page title) and <H2> (section heads); never substitute <Display2>
  for an in-app screen - its 48 px rhythm dominates dashboard chrome.
-->
<h1 class="dash-ui-display-2 {className}">
  {@render children?.()}
</h1>
