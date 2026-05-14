<script lang="ts">
  interface Props {
    prefix?: string | undefined;
    suffix?: string | undefined;
    children?: import('svelte').Snippet;
  }

  let { prefix = undefined, suffix = undefined, children }: Props = $props();
</script>

<!--
  Input group: prefix / suffix addons flank a slot-rendered `<Input>` and
  trim/round its corners. The `[&_input]:rounded-none` selector targets the
  child input regardless of its own utility classes. Addons inherit the
  same height as the migrated Input (34px).
-->
<div
  class="flex items-stretch
    [&_input]:flex-1 [&_input]:min-w-0 [&_input]:rounded-none
    {prefix === undefined ? '[&_input]:rounded-l-md' : ''}
    {suffix === undefined ? '[&_input]:rounded-r-md' : ''}"
>
  {#if prefix !== undefined}
    <span class="flex shrink-0 select-none items-center whitespace-nowrap rounded-l-md border border-r-0 border-white/10 bg-white/[0.06] px-2.5 text-13 text-[#6e7079]">{prefix}</span>
  {/if}
  {@render children?.()}
  {#if suffix !== undefined}
    <span class="flex shrink-0 select-none items-center whitespace-nowrap rounded-r-md border border-l-0 border-white/10 bg-white/[0.06] px-2.5 text-13 text-[#6e7079]">{suffix}</span>
  {/if}
</div>
