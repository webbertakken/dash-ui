<script lang="ts">
  interface Props {
    class?: string;
    children?: import('svelte').Snippet;
  }

  let { class: className = '', children }: Props = $props();
</script>

<!--
  Display-1 - the 64 px / bold / --lh-tight / --tracking-display
  (-0.02em) rhythm reserved for onboarding splashes and marketing
  heroes (the top of the type scale, one step above the 48 px
  <Display2>). Renders <h1 class="dash-ui-display-1"> so the
  .dash-ui-display-1 rule in @w5-ui/tokens/tokens.css pins the canonical
  size, weight, line-height, letter-spacing, and --text-1 colour. Stops
  userland reaching for an ad-hoc <h1 style="font-size: 64px"> that
  almost always forgets --lh-tight (1.1) and the negative tracking,
  which is the documented "headings break awkwardly across two lines"
  drift in Foundations / Type. Typed equivalent of
  <h1 class="dash-ui-display-1"> (the userland-facing semantic class
  documented in Foundations / Type). Use for onboarding splashes or
  large marketing heroes. In-app pages should reach for <PageHeader>
  (page title) and <H2> (section heads); never substitute <Display1>
  for an in-app screen - its 64 px rhythm dwarfs dashboard chrome.
-->
<h1 class="dash-ui-display-1 {className}">
  {@render children?.()}
</h1>
