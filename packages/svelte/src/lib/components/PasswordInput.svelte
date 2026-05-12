<script module lang="ts">
  let counter = 0;
</script>

<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  interface Props {
    label?: string | undefined;
    value?: string;
    placeholder?: string | undefined;
    disabled?: boolean;
    autocomplete?: 'current-password' | 'new-password' | 'off';
    class?: string;
  }

  let {
    label = undefined,
    value = $bindable(''),
    placeholder = undefined,
    disabled = false,
    autocomplete = 'current-password',
    class: className = ''
  }: Props = $props();
  

  const dispatch = createEventDispatcher<{ change: string }>();
  const uid = `dash-ui-pwd-${++counter}`;

  let shown = $state(false);

  function handleInput(e: Event) {
    value = (e.target as HTMLInputElement).value;
    dispatch('change', value);
  }
</script>

<div class="pwd-input-wrapper {className}">
  {#if label}
    <label for={uid} class="pwd-input__label">{label}</label>
  {/if}
  <div class="pwd-input{disabled ? ' pwd-input--disabled' : ''}">
    <input
      id={uid}
      type={shown ? 'text' : 'password'}
      class="pwd-input__field"
      {value}
      {placeholder}
      {disabled}
      {autocomplete}
      oninput={handleInput}
    />
    <button
      type="button"
      class="pwd-input__toggle"
      aria-pressed={shown}
      aria-label={shown ? 'Hide password' : 'Show password'}
      {disabled}
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
