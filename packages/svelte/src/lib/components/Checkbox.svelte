<script context="module" lang="ts">
  let counter = 0;
</script>

<script lang="ts">
  export let checked: boolean = false;
  export let indeterminate: boolean = false;
  export let label: string | undefined = undefined;
  export let id: string | undefined = undefined;
  export let disabled: boolean = false;

  const uid = `dash-ui-cb-${++counter}`;
  $: inputId = id ?? uid;

  let el: HTMLInputElement;
  $: if (el) {
    el.checked = checked;
    el.indeterminate = indeterminate;
  }
</script>

{#if label}
  <label class="checkbox-label" for={inputId}>
    <input
      bind:this={el}
      type="checkbox"
      id={inputId}
      {disabled}
      class="checkbox"
      on:change
      {...$$restProps}
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
    on:change
    {...$$restProps}
  />
{/if}
