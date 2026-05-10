<script lang="ts">
  export let keys: string | string[];
  let className = '';
  export { className as class };

  $: parts = typeof keys === 'string' ? keys.split('+') : keys;
</script>

<kbd class="kbd {className}">
  {#each parts as key, i}
    <span class="kbd__segment">
      {#if i > 0}<span class="kbd__plus" aria-hidden="true">+</span>{/if}
      <kbd class="kbd__key">{key}</kbd>
    </span>
  {/each}
</kbd>
