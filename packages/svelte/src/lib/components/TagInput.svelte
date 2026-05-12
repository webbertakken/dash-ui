<script context="module" lang="ts">
  let counter = 0;
</script>

<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  export let label: string | undefined = undefined;
  export let value: string[] = [];
  export let placeholder: string = 'Type and press Enter…';
  export let disabled: boolean = false;
  let klass = '';
  export { klass as class };

  const dispatch = createEventDispatcher<{ change: string[] }>();
  const uid = `dash-ui-tag-input-${++counter}`;

  let draft = '';
  let inputEl: HTMLInputElement;

  function addTag(raw: string) {
    const trimmed = raw.trim();
    if (!trimmed || value.includes(trimmed)) return;
    value = [...value, trimmed];
    draft = '';
    dispatch('change', value);
  }

  function removeTag(index: number) {
    value = value.filter((_, i) => i !== index);
    dispatch('change', value);
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'Enter' || e.key === ',' || e.key === 'Tab') {
      if (draft.trim()) {
        e.preventDefault();
        addTag(draft);
      }
    } else if (e.key === 'Backspace' && draft === '' && value.length > 0) {
      removeTag(value.length - 1);
    }
  }

  function handleBlur() {
    if (draft.trim()) addTag(draft);
  }
</script>

<div class="tag-input-wrapper {klass}">
  {#if label}
    <label for={uid} class="tag-input__label">{label}</label>
  {/if}
  <!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
  <!-- svelte-ignore a11y-no-noninteractive-element-interactions - group container focuses input on click -->
  <div
    role="group"
    aria-label={label ?? 'Tags'}
    class="tag-input{disabled ? ' tag-input--disabled' : ''}"
    on:click={() => inputEl?.focus()}
  >
    {#each value as tag, i}
      <span class="tag">
        <span class="tag__label">{tag}</span>
        {#if !disabled}
          <button
            type="button"
            class="tag__remove"
            aria-label="Remove {tag}"
            on:click|stopPropagation={() => removeTag(i)}
          >
            <svg viewBox="0 0 10 10" width="10" height="10" fill="none" aria-hidden="true" focusable="false">
              <path d="M2 2l6 6M8 2l-6 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </button>
        {/if}
      </span>
    {/each}
    <input
      bind:this={inputEl}
      id={uid}
      type="text"
      class="tag-input__field"
      bind:value={draft}
      {disabled}
      placeholder={value.length === 0 ? placeholder : ''}
      aria-label={label ?? 'Add tag'}
      autocomplete="off"
      on:keydown={handleKeyDown}
      on:blur={handleBlur}
    />
  </div>
</div>
