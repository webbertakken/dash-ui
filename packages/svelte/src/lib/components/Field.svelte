<script module lang="ts">
  let counter = 0;
</script>

<script lang="ts">
  interface Props {
    label: string;
    value?: string;
    id?: string | undefined;
    error?: string | undefined;
    required?: boolean;
    hint?: string | undefined;
    children?: import('svelte').Snippet;
  }

  let {
    label,
    value = $bindable(''),
    id = undefined,
    error = undefined,
    required = false,
    hint = undefined,
    children
  }: Props = $props();
  // svelte-ignore state_referenced_locally
  const inputId = id ?? `dash-ui-field-${++counter}`;
  let errorId = $derived(error ? `${inputId}-error` : undefined);
  let hintId = $derived(hint ? `${inputId}-hint` : undefined);
  let describedBy = $derived([hintId, errorId].filter(Boolean).join(' ') || undefined);
</script>

<div class="field">
  <label for={inputId}>
    {label}{#if required}<span class="req" aria-hidden="true"> *</span>{/if}
  </label>
  {#if hint}
    <div class="field-hint" id={hintId}>{hint}</div>
  {/if}
  {#if children}
    {@render children?.()}
  {:else}
    <input
      class="input"
      id={inputId}
      bind:value
      {required}
      aria-invalid={error ? true : undefined}
      aria-describedby={describedBy}
    />
  {/if}
  {#if error}
    <div class="field-error" id={errorId} role="alert">{error}</div>
  {/if}
</div>
