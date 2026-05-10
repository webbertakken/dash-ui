<script context="module" lang="ts">
  let counter = 0;
</script>

<script lang="ts">
  export let value: string = '';
  export let rows: number = 4;
  export let placeholder: string | undefined = undefined;
  export let disabled: boolean = false;
  export let readonly: boolean = false;
  export let id: string | undefined = undefined;
  let className = '';
  export { className as class };

  const uid = `dash-ui-ta-${++counter}`;
  $: inputId = id ?? uid;
</script>

<textarea
  id={inputId}
  class="input textarea {className}"
  {rows}
  {placeholder}
  {disabled}
  readonly={readonly}
  bind:value
  on:input
  on:change
  on:focus
  on:blur
></textarea>
