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
    children,
  }: Props = $props();
  // svelte-ignore state_referenced_locally
  const inputId = id ?? `dash-ui-field-${++counter}`;
  let errorId = $derived(error ? `${inputId}-error` : undefined);
  let hintId = $derived(hint ? `${inputId}-hint` : undefined);
  let describedBy = $derived([hintId, errorId].filter(Boolean).join(' ') || undefined);
</script>

<div class="mb-3 flex flex-col gap-1.5">
  <label for={inputId} class="text-12 font-medium text-neutral-04">
    {label}{#if required}<span class="text-status-danger" aria-hidden="true"> *</span>{/if}
  </label>
  {#if hint}
    <div class="text-12 text-neutral-04" id={hintId}>{hint}</div>
  {/if}
  {#if children}
    {@render children?.()}
  {:else}
    <input
      class="h-[34px] w-full rounded-md border border-white/10 bg-neutral-10 px-3 text-13 text-white outline-none transition-[border-color] duration-100 focus:border-brand-05 focus:[box-shadow:0_0_0_2px_rgba(0,111,255,0.2)] aria-[invalid='true']:border-status-danger aria-[invalid='true']:focus:[box-shadow:0_0_0_2px_rgba(240,58,58,0.12)]"
      id={inputId}
      bind:value
      {required}
      aria-invalid={error ? true : undefined}
      aria-describedby={describedBy}
    />
  {/if}
  {#if error}
    <div class="text-12 text-status-danger" id={errorId} role="alert">{error}</div>
  {/if}
</div>
