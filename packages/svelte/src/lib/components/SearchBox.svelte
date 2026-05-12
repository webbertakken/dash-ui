<script lang="ts">
  import SearchIcon from '../icons/SearchIcon.svelte';

  interface Props {
    placeholder?: string;
    value?: string;
    ariaLabel?: string;
    oninput?: (event: Event) => void;
    onchange?: (event: Event) => void;
  }

  let {
    placeholder = '',
    value = $bindable(''),
    ariaLabel = '',
    oninput,
    onchange,
  }: Props = $props();
</script>

<div class="search" role="search">
  <span aria-hidden="true" style="display:inline-flex">
    <SearchIcon size={14} style="color:#6E7079" />
  </span>
  <input
    type="search"
    {placeholder}
    aria-label={ariaLabel || placeholder}
    bind:value
    {oninput}
    {onchange}
  />
</div>
