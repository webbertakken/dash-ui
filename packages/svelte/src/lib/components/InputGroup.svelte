<script lang="ts">
  interface Props {
    prefix?: string | undefined;
    suffix?: string | undefined;
    children?: import('svelte').Snippet;
  }

  let { prefix = undefined, suffix = undefined, children }: Props = $props();
</script>

<div class="input-group">
  {#if prefix !== undefined}
    <span class="input-group-addon input-group-addon--prefix">{prefix}</span>
  {/if}
  {@render children?.()}
  {#if suffix !== undefined}
    <span class="input-group-addon input-group-addon--suffix">{suffix}</span>
  {/if}
</div>
