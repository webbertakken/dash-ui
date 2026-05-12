<script lang="ts">
  interface Props {
    value?: string;
    placeholder?: string;
    type?: string;
    class?: string;
    style?: string;
    oninput?: (event: Event) => void;
    onchange?: (event: Event) => void;
    onfocus?: (event: FocusEvent) => void;
    onblur?: (event: FocusEvent) => void;
  }

  let {
    value = $bindable(''),
    placeholder = '',
    type = 'text',
    class: className = '',
    style = '',
    oninput,
    onchange,
    onfocus,
    onblur,
  }: Props = $props();
</script>

{#if type === 'text'}
  <input
    class="input {className}"
    type="text"
    {placeholder}
    bind:value
    {style}
    {oninput}
    {onchange}
    {onfocus}
    {onblur}
  />
{:else if type === 'password'}
  <input
    class="input {className}"
    type="password"
    {placeholder}
    bind:value
    {style}
    {oninput}
    {onchange}
    {onfocus}
    {onblur}
  />
{:else if type === 'number'}
  <input
    class="input {className}"
    type="number"
    {placeholder}
    bind:value
    {style}
    {oninput}
    {onchange}
    {onfocus}
    {onblur}
  />
{:else}
  <input
    class="input {className}"
    {type}
    {placeholder}
    {value}
    {style}
    {oninput}
    {onchange}
    {onfocus}
    {onblur}
  />
{/if}
