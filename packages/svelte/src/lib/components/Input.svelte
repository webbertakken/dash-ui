<script lang="ts">
  import { createBubbler } from 'svelte/legacy';

  const bubble = createBubbler();
  
  interface Props {
    value?: string;
    placeholder?: string;
    type?: string;
    class?: string;
    style?: string;
  }

  let {
    value = $bindable(''),
    placeholder = '',
    type = 'text',
    class: className = '',
    style = ''
  }: Props = $props();
</script>

{#if type === 'text'}
  <input class="input {className}" type="text" {placeholder} bind:value {style} oninput={bubble('input')} onchange={bubble('change')} onfocus={bubble('focus')} onblur={bubble('blur')} />
{:else if type === 'password'}
  <input class="input {className}" type="password" {placeholder} bind:value {style} oninput={bubble('input')} onchange={bubble('change')} onfocus={bubble('focus')} onblur={bubble('blur')} />
{:else if type === 'number'}
  <input class="input {className}" type="number" {placeholder} bind:value {style} oninput={bubble('input')} onchange={bubble('change')} onfocus={bubble('focus')} onblur={bubble('blur')} />
{:else}
  <input class="input {className}" {type} {placeholder} value={value} {style} oninput={bubble('input')} onchange={bubble('change')} onfocus={bubble('focus')} onblur={bubble('blur')} />
{/if}
