<script lang="ts">
  import SearchIcon from '../icons/SearchIcon.svelte';
  export let placeholder: string = '';
  export let value: string = '';
  export let ariaLabel: string = '';
</script>

<div class="search" role="search">
  <span aria-hidden="true" style="display:inline-flex"><SearchIcon size={14} style="color:#6E7079" /></span>
  <input type="search" {placeholder} aria-label={ariaLabel || placeholder} bind:value on:input on:change />
</div>
