<script lang="ts">
  interface Props {
    title: string;
    sticky?: boolean;
    class?: string;
    actions?: import('svelte').Snippet;
  }

  let {
    title,
    sticky = true,
    class: className = '',
    actions,
  }: Props = $props();
</script>

<div
  class="ph-bar {className}"
  style={sticky ? undefined : 'position: static'}
>
  <h2 class="ph-title">{title}</h2>
  {#if actions}
    <div class="ph-actions">{@render actions?.()}</div>
  {/if}
</div>
