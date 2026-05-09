<script lang="ts">
  export let label: string;
  export let value: string = '';
</script>

<div class="field">
  <label>{label}</label>
  {#if $$slots.default}
    <slot />
  {:else}
    <input class="input" bind:value />
  {/if}
</div>
