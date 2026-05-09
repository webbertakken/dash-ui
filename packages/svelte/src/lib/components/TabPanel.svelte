<script lang="ts">
  export let id: string;
  export let active: string;
  $: isActive = id === active;
</script>

<div
  role="tabpanel"
  id="tabpanel-{id}"
  aria-labelledby="tab-{id}"
  hidden={!isActive}
  tabindex="0"
>
  {#if isActive}
    <slot />
  {/if}
</div>
