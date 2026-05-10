<script lang="ts">
  export let prefix: string | undefined = undefined;
  export let suffix: string | undefined = undefined;
</script>

<div class="input-group">
  {#if prefix !== undefined}
    <span class="input-group-addon input-group-addon--prefix">{prefix}</span>
  {/if}
  <slot />
  {#if suffix !== undefined}
    <span class="input-group-addon input-group-addon--suffix">{suffix}</span>
  {/if}
</div>
