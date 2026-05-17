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

<div
  class="flex h-[30px] w-60 items-center gap-1.5 rounded-md border border-border-1 bg-bg-1 px-2.5 focus-within:border-brand-05"
  role="search"
>
  <span aria-hidden="true" class="inline-flex">
    <SearchIcon size={14} style="color:#6E7079" />
  </span>
  <input
    type="search"
    {placeholder}
    aria-label={ariaLabel || placeholder}
    bind:value
    {oninput}
    {onchange}
    class="min-w-0 flex-1 border-0 bg-transparent text-13 text-text-1 outline-none placeholder:text-text-4"
  />
</div>
