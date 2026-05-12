<script module lang="ts">
  let counter = 0;
</script>

<script lang="ts">
  import { createBubbler } from 'svelte/legacy';

  const bubble = createBubbler();
  
  interface Props {
    value?: string;
    rows?: number;
    placeholder?: string | undefined;
    disabled?: boolean;
    readonly?: boolean;
    id?: string | undefined;
    class?: string;
    style?: string;
  }

  let {
    value = $bindable(''),
    rows = 4,
    placeholder = undefined,
    disabled = false,
    readonly = false,
    id = undefined,
    class: className = '',
    style = ''
  }: Props = $props();

  const uid = `dash-ui-ta-${++counter}`;
  let inputId = $derived(id ?? uid);
</script>

<textarea
  id={inputId}
  class="input textarea {className}"
  {style}
  {rows}
  {placeholder}
  {disabled}
  readonly={readonly}
  bind:value
  oninput={bubble('input')}
  onchange={bubble('change')}
  onfocus={bubble('focus')}
  onblur={bubble('blur')}
></textarea>
