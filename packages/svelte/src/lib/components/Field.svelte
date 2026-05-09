<script context="module" lang="ts">
  let counter = 0;
</script>

<script lang="ts">
  export let label: string;
  export let value: string = '';
  export let id: string | undefined = undefined;
  export let error: string | undefined = undefined;
  export let required: boolean = false;
  export let hint: string | undefined = undefined;
  const inputId = id ?? `dash-ui-field-${++counter}`;
  $: errorId = error ? `${inputId}-error` : undefined;
  $: hintId = hint ? `${inputId}-hint` : undefined;
  $: describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined;
</script>

<div class="field">
  <label for={inputId}>
    {label}{#if required}<span class="req" aria-hidden="true"> *</span>{/if}
  </label>
  {#if hint}
    <div class="field-hint" id={hintId}>{hint}</div>
  {/if}
  {#if $$slots.default}
    <slot />
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
