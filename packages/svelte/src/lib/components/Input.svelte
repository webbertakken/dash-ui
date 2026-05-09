<script lang="ts">
  export let value: string = '';
  export let placeholder: string = '';
  export let type: string = 'text';
  let className = '';
  export { className as class };
  export let style: string = '';
</script>

{#if type === 'text'}
  <input class="input {className}" type="text" {placeholder} bind:value {style} on:input on:change on:focus on:blur />
{:else if type === 'password'}
  <input class="input {className}" type="password" {placeholder} bind:value {style} on:input on:change on:focus on:blur />
{:else if type === 'number'}
  <input class="input {className}" type="number" {placeholder} bind:value {style} on:input on:change on:focus on:blur />
{:else}
  <input class="input {className}" {type} {placeholder} value={value} {style} on:input on:change on:focus on:blur />
{/if}
