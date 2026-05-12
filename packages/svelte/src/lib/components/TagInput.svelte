<script module lang="ts">
  let counter = 0;
</script>

<script lang="ts">
  import { stopPropagation } from 'svelte/legacy';

  import { createEventDispatcher } from 'svelte';

  interface Props {
    label?: string | undefined;
    value?: string[];
    placeholder?: string;
    disabled?: boolean;
    class?: string;
  }

  let {
    label = undefined,
    value = $bindable([]),
    placeholder = 'Type and press Enter…',
    disabled = false,
    class: klass = ''
  }: Props = $props();
  

  const dispatch = createEventDispatcher<{ change: string[] }>();
  const uid = `dash-ui-tag-input-${++counter}`;

  let draft = $state('');
  let inputEl: HTMLInputElement = $state();

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
  <!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
  <!-- svelte-ignore a11y_no_noninteractive_element_interactions - group container focuses input on click -->
  <div
    role="group"
    aria-label={label ?? 'Tags'}
    class="tag-input{disabled ? ' tag-input--disabled' : ''}"
    onclick={() => inputEl?.focus()}
  >
    {#each value as tag, i}
      <span class="tag">
        <span class="tag__label">{tag}</span>
        {#if !disabled}
          <button
            type="button"
            class="tag__remove"
            aria-label="Remove {tag}"
            onclick={stopPropagation(() => removeTag(i))}
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
      onkeydown={handleKeyDown}
      onblur={handleBlur}
    />
  </div>
</div>
