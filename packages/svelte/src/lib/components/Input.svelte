<script module lang="ts">
  // Shared utility-class string for native input elements. Matches the
  // dashboard.css `.input` rule exactly so Field + Input render identically
  // and old markup with `class="input"` keeps working through the
  // unmigrated tail. Update both sites in lockstep if it ever moves.
  export const INPUT_CLASSES =
    "h-[34px] w-full rounded-md border border-white/10 bg-neutral-10 px-3 text-13 text-white outline-none transition-[border-color] duration-100 focus:border-brand-05 focus:[box-shadow:0_0_0_2px_rgba(0,111,255,0.2)] aria-[invalid='true']:border-status-danger aria-[invalid='true']:focus:[box-shadow:0_0_0_2px_rgba(240,58,58,0.12)]";
</script>

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
    class="{INPUT_CLASSES} {className}"
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
    class="{INPUT_CLASSES} {className}"
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
    class="{INPUT_CLASSES} {className}"
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
    class="{INPUT_CLASSES} {className}"
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
