<script module lang="ts">
  let counter = 0;
</script>

<script lang="ts">
  interface Props {
    value?: string;
    rows?: number;
    placeholder?: string | undefined;
    disabled?: boolean;
    readonly?: boolean;
    id?: string | undefined;
    class?: string;
    style?: string;
    oninput?: (event: Event) => void;
    onchange?: (event: Event) => void;
    onfocus?: (event: FocusEvent) => void;
    onblur?: (event: FocusEvent) => void;
  }

  let {
    value = $bindable(''),
    rows = 4,
    placeholder = undefined,
    disabled = false,
    readonly = false,
    id = undefined,
    class: className = '',
    style = '',
    oninput,
    onchange,
    onfocus,
    onblur,
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
  {readonly}
  bind:value
  {oninput}
  {onchange}
  {onfocus}
  {onblur}
></textarea>
