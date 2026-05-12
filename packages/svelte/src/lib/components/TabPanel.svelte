<script lang="ts">
  interface Props {
    id: string;
    active: string;
    children?: import('svelte').Snippet;
  }

  let { id, active, children }: Props = $props();
  let isActive = $derived(id === active);
</script>

<div
  role="tabpanel"
  id="tabpanel-{id}"
  aria-labelledby="tab-{id}"
  hidden={!isActive}
  tabindex="0"
>
  {#if isActive}
    {@render children?.()}
  {/if}
</div>
