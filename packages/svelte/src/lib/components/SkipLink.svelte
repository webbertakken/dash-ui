<script lang="ts">
  interface Props {
    href?: string;
    class?: string;
    children?: import('svelte').Snippet;
  }

  let { href = '#main-content', class: className = '', children }: Props = $props();
</script>

<a
  class="absolute left-0 top-0 z-[100] -translate-y-full rounded-br-md bg-brand-05 px-3 py-2 text-13 font-semibold text-white no-underline focus:translate-y-0 focus:outline-2 focus:-outline-offset-4 focus:outline-white
    {className}"
  {href}
>
  {#if children}{@render children()}{:else}Skip to main content{/if}
</a>
