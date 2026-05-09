<script lang="ts">
  import SearchIcon from '../icons/SearchIcon.svelte';
  export let placeholder: string = '';
  export let value: string = '';
</script>

<div class="search">
  <SearchIcon size={14} style="color:#6E7079" />
  <input {placeholder} bind:value on:input on:change />
</div>
