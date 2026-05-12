<script lang="ts">
  interface Props {
    href?: string;
    class?: string;
    children?: import('svelte').Snippet;
  }

  let { href = '#main-content', class: className = '', children }: Props = $props();
  
</script>

<a class="skip-link {className}" {href}>
  {#if children}{@render children()}{:else}Skip to main content{/if}
</a>
