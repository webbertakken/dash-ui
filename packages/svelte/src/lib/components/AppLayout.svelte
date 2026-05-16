<script lang="ts">
  import SkipLink from './SkipLink.svelte';

  interface Props {
    /** Page title for the visually-hidden h1 that labels main (WCAG 2.4.6). */
    pageLabel: string;
    class?: string;
    /** Topbar snippet, typically a Topbar component. */
    topbar?: import('svelte').Snippet;
    /** Sidebar snippet, typically a Sidebar component. */
    sidebar?: import('svelte').Snippet;
    children?: import('svelte').Snippet;
  }

  let {
    pageLabel,
    class: className = '',
    topbar,
    sidebar,
    children,
  }: Props = $props();
</script>

<div class="app {className}">
  <SkipLink />
  {@render topbar?.()}
  <div class="workspace">
    {@render sidebar?.()}
    <main class="content" id="main-content" tabindex="-1" aria-labelledby="page-title">
      <h1 id="page-title" class="sr-only">{pageLabel}</h1>
      {@render children?.()}
    </main>
  </div>
</div>
