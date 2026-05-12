<script lang="ts">
  import { createBubbler } from 'svelte/legacy';

  const bubble = createBubbler();
  import SearchIcon from '../icons/SearchIcon.svelte';
  interface Props {
    placeholder?: string;
    value?: string;
    ariaLabel?: string;
  }

  let { placeholder = '', value = $bindable(''), ariaLabel = '' }: Props = $props();
</script>

<div class="search" role="search">
  <span aria-hidden="true" style="display:inline-flex"><SearchIcon size={14} style="color:#6E7079" /></span>
  <input type="search" {placeholder} aria-label={ariaLabel || placeholder} bind:value oninput={bubble('input')} onchange={bubble('change')} />
</div>
