<script module lang="ts">
  let counter = 0;
</script>

<script lang="ts">
  interface Props {
    checked?: boolean;
    indeterminate?: boolean;
    label?: string | undefined;
    id?: string | undefined;
    disabled?: boolean;
    onchange?: (event: Event) => void;
    [key: string]: unknown;
  }

  let {
    checked = false,
    indeterminate = false,
    label = undefined,
    id = undefined,
    disabled = false,
    onchange,
    ...rest
  }: Props = $props();

  const uid = `dash-ui-cb-${++counter}`;
  let inputId = $derived(id ?? uid);

  let el = $state<HTMLInputElement | undefined>(undefined);

  // Sync the imperative DOM properties to the reactive props. `$effect` reads
  // both `checked` and `indeterminate` so it re-runs whenever either flips.
  $effect(() => {
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
      {onchange}
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
    {onchange}
    {...rest}
  />
{/if}
