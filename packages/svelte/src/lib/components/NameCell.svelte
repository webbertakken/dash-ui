<script lang="ts">
  interface Props {
    class?: string;
    /**
     * Extra class for the inner .nc-thumb (e.g. "cam" for the camera
     * gradient variant). Ignored when the thumb snippet is not supplied.
     */
    thumbClass?: string;
    /**
     * Square 28px avatar / initial that sits to the left of the name. Pass
     * a snippet rendering a letter, emoji, or small SVG. Omit if the row
     * has no leading affordance.
     */
    thumb?: import('svelte').Snippet;
    children?: import('svelte').Snippet;
  }

  let { class: className = '', thumbClass = '', thumb, children }: Props = $props();
</script>

<!--
  First-column row in a list / table: a 28px square thumbnail or initial
  followed by the device / client / alert name. Renders the canonical
  <div class="name-cell"><span class="nc-thumb">...</span>...</div> markup
  so the .name-cell and .nc-thumb rules from @w5-ui/tokens/dashboard.css
  apply (28px thumb, 10px gap, white name colour, JetBrains Mono initial).
  Typed equivalent of the manual <div class="name-cell">... pattern used
  across the Dashboard, Devices, Wi-Fi, and Alarms reference pages.
-->
<div class="name-cell {className}">
  {#if thumb}
    <span class="nc-thumb {thumbClass}">{@render thumb()}</span>
  {/if}
  {@render children?.()}
</div>
