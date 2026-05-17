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

<!--
  Textarea reuses the dashboard.css/Input layout (.input + .textarea sit
  together; the `auto` height + min-height: 80px + resize: vertical + 8px
  vertical padding + 1.5 line-height overrides come from .textarea). All
  inline now.
-->
<textarea
  id={inputId}
  class="block min-h-20 w-full resize-y rounded-md border border-border-2 bg-bg-page px-3 py-2 font-[inherit] text-13 leading-[1.5] text-text-1 outline-none transition-[border-color] duration-100 focus:border-brand-05 focus:[box-shadow:0_0_0_2px_rgba(0,111,255,0.2)] aria-[invalid='true']:border-status-danger aria-[invalid='true']:focus:[box-shadow:0_0_0_2px_rgba(240,58,58,0.12)] {className}"
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
