<script module lang="ts">
  let counter = 0;
</script>

<script lang="ts">
  interface Props {
    label?: string | undefined;
    value?: string;
    placeholder?: string | undefined;
    disabled?: boolean;
    autocomplete?: 'current-password' | 'new-password' | 'off';
    class?: string;
    onchange?: (payload: string) => void;
  }

  let {
    label = undefined,
    value = $bindable(''),
    placeholder = undefined,
    disabled = false,
    autocomplete = 'current-password',
    class: className = '',
    onchange,
  }: Props = $props();
  const uid = `dash-ui-pwd-${++counter}`;

  let shown = $state(false);

  function handleInput(e: Event) {
    value = (e.target as HTMLInputElement).value;
    onchange?.(value);
  }
</script>

<div class={className}>
  {#if label}
    <label for={uid} class="text-12 text-text-4">{label}</label>
  {/if}
  <div
    data-disabled={disabled ? 'true' : undefined}
    class="flex h-[34px] items-stretch overflow-hidden rounded-md border border-border-2 bg-bg-page transition-colors duration-100 focus-within:border-brand-05 data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-40"
  >
    <input
      id={uid}
      type={shown ? 'text' : 'password'}
      class="min-w-0 flex-1 border-0 bg-transparent px-3 text-13 text-text-1 outline-none placeholder:text-text-4"
      {value}
      {placeholder}
      {disabled}
      {autocomplete}
      oninput={handleInput}
    />
    <button
      type="button"
      aria-pressed={shown}
      aria-label={shown ? 'Hide password' : 'Show password'}
      {disabled}
      class="inline-flex h-full w-9 shrink-0 cursor-pointer items-center justify-center border-0 border-l border-l-white/[0.08] bg-transparent text-text-4 transition-colors duration-100 hover:bg-row-hover hover:text-text-1 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-brand-05"
      onclick={() => (shown = !shown)}
    >
      {#if shown}
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" focusable="false">
          <path d="M2 2l12 12M6.5 6.6A2 2 0 0 0 9.4 9.5M4.2 4.3C2.7 5.3 1.5 7 1.5 8s2.2 4.5 6.5 4.5c1.3 0 2.4-.3 3.3-.8M7 3.6C7.3 3.5 7.7 3.5 8 3.5c4.3 0 6.5 3.5 6.5 4.5 0 .6-.6 1.7-1.7 2.7" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      {:else}
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" focusable="false">
          <path d="M1 8s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5z" stroke="currentColor" stroke-width="1.25" stroke-linejoin="round"/>
          <circle cx="8" cy="8" r="2" stroke="currentColor" stroke-width="1.25"/>
        </svg>
      {/if}
    </button>
  </div>
</div>
