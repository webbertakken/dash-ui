<script lang="ts">
  interface Props {
    keys: string | string[];
    class?: string;
  }

  let { keys, class: className = '' }: Props = $props();
  

  let parts = $derived(typeof keys === 'string' ? keys.split('+') : keys);
</script>

<kbd class="kbd {className}">
  {#each parts as key, i}
    <span class="kbd__segment">
      {#if i > 0}<span class="kbd__plus" aria-hidden="true">+</span>{/if}
      <kbd class="kbd__key">{key}</kbd>
    </span>
  {/each}
</kbd>
