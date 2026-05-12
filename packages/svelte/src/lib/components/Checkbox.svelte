<script module lang="ts">
  let counter = 0;
</script>

<script lang="ts">
  import { run, createBubbler } from 'svelte/legacy';

  const bubble = createBubbler();
  interface Props {
    checked?: boolean;
    indeterminate?: boolean;
    label?: string | undefined;
    id?: string | undefined;
    disabled?: boolean;
    [key: string]: any
  }

  let {
    checked = false,
    indeterminate = false,
    label = undefined,
    id = undefined,
    disabled = false,
    ...rest
  }: Props = $props();

  const uid = `dash-ui-cb-${++counter}`;
  let inputId = $derived(id ?? uid);

  let el: HTMLInputElement = $state();
  run(() => {
    if (el) {
      el.checked = checked;
      el.indeterminate = indeterminate;
    }
  });
</script>

{#if label}
  <label class="checkbox-label" for={inputId}>
    <input
      bind:this={el}
      type="checkbox"
      id={inputId}
      {disabled}
      class="checkbox"
      onchange={bubble('change')}
      {...rest}
    />
    <span>{label}</span>
  </label>
{:else}
  <input
    bind:this={el}
    type="checkbox"
    id={inputId}
    {disabled}
    class="checkbox"
    onchange={bubble('change')}
    {...rest}
  />
{/if}
