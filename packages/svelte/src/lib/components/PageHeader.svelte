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
  class="flex items-center justify-between px-6 py-[14px] border-b border-white/[0.06] bg-[#0a0a0b] {sticky ? 'sticky top-0 z-5' : ''} {className}"
>
  <h2 class="m-0 text-[18px] font-semibold tracking-[-0.005em] text-white">{title}</h2>
  {#if actions}
    <div class="flex items-center gap-2">{@render actions?.()}</div>
  {/if}
</div>
