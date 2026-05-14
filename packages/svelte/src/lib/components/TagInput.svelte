<script module lang="ts">
  let counter = 0;
</script>

<script lang="ts">
  interface Props {
    label?: string | undefined;
    value?: string[];
    placeholder?: string;
    disabled?: boolean;
    class?: string;
    onchange?: (payload: string[]) => void;
  }

  let {
    label = undefined,
    value = $bindable([]),
    placeholder = 'Type and press Enter…',
    disabled = false,
    class: klass = '',
    onchange,
  }: Props = $props();
  const uid = `dash-ui-tag-input-${++counter}`;

  let draft = $state('');
  let inputEl = $state<HTMLInputElement | undefined>(undefined);

  function addTag(raw: string) {
    const trimmed = raw.trim();
    if (!trimmed || value.includes(trimmed)) return;
    value = [...value, trimmed];
    draft = '';
    onchange?.(value);
  }

  function removeTag(index: number) {
    value = value.filter((_, i) => i !== index);
    onchange?.(value);
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

<div class={klass}>
  {#if label}
    <label for={uid} class="text-12 text-[#6e7079]">{label}</label>
  {/if}
  <!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
  <!-- svelte-ignore a11y_no_noninteractive_element_interactions - group container focuses input on click -->
  <div
    role="group"
    aria-label={label ?? 'Tags'}
    data-disabled={disabled ? 'true' : undefined}
    class="flex min-h-[34px] cursor-text flex-wrap items-center gap-1 rounded-md border border-white/10 bg-[#0a0a0b] py-[3px] pl-2 pr-2 transition-colors duration-100 hover:border-white/20 focus-within:border-brand-05 focus-within:shadow-[0_0_0_2px_rgba(0,111,255,0.2)] data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-40"
    onclick={() => inputEl?.focus()}
  >
    {#each value as tag, i}
      <span class="inline-flex h-6 items-center gap-1 whitespace-nowrap rounded-full border border-brand-05/25 bg-brand-05/[0.14] pl-2.5 pr-1 text-12 font-medium text-[#7fb6ff]">
        <span class="leading-none">{tag}</span>
        {#if !disabled}
          <button
            type="button"
            aria-label={`Remove ${tag}`}
            class="inline-flex h-[18px] w-[18px] shrink-0 cursor-pointer items-center justify-center rounded-full border-0 bg-transparent p-0 text-[#7fb6ff] transition-colors duration-100 hover:bg-brand-05/25 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brand-05"
            onclick={(e) => { e.stopPropagation(); (() => removeTag(i))(); }}
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
      bind:value={draft}
      {disabled}
      placeholder={value.length === 0 ? placeholder : ''}
      aria-label={label ?? 'Add tag'}
      autocomplete="off"
      class="h-6 min-w-[80px] flex-1 border-0 bg-transparent px-1 text-13 leading-none text-white outline-none placeholder:text-[#6e7079]"
      onkeydown={handleKeyDown}
      onblur={handleBlur}
    />
  </div>
</div>
