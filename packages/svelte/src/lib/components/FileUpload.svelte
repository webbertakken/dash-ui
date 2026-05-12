<script lang="ts">
  

  interface Props {
    label?: string;
    hint?: string | undefined;
    accept?: string | undefined;
    multiple?: boolean;
    disabled?: boolean;
    onfiles?: (payload: File[]) => void;
  }

  let {
    label = 'Upload file',
    hint = undefined,
    accept = undefined,
    multiple = false,
    disabled = false,
    onfiles,
  }: Props = $props();
  let drag = $state(false);
  let done: string | null = $state(null);
  let inputEl: HTMLInputElement = $state();

  function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    const arr = Array.from(files);
    done = arr.length === 1 ? arr[0].name : `${arr.length} files selected`;
    onfiles?.(arr);
  }

  function onChange(e: Event) {
    handleFiles((e.target as HTMLInputElement).files);
    (e.target as HTMLInputElement).value = '';
  }

  function onDragOver(e: DragEvent) {
    e.preventDefault();
    if (!disabled) drag = true;
  }

  function onDragLeave(e: DragEvent) {
    if (!(e.currentTarget as HTMLElement).contains(e.relatedTarget as Node)) {
      drag = false;
    }
  }

  function onDrop(e: DragEvent) {
    e.preventDefault();
    drag = false;
    if (!disabled) handleFiles(e.dataTransfer?.files ?? null);
  }

  function onClick() {
    if (!disabled) inputEl.click();
  }

  function onKeyDown(e: KeyboardEvent) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (!disabled) inputEl.click();
    }
  }
</script>

<div
  role="button"
  class="file-upload"
  class:file-upload--drag={drag}
  class:file-upload--done={done}
  class:file-upload--disabled={disabled}
  ondragover={onDragOver}
  ondragleave={onDragLeave}
  ondrop={onDrop}
  onclick={onClick}
  onkeydown={onKeyDown}
  tabindex={disabled ? -1 : 0}
  aria-label={done ?? label}
>
  <input
    bind:this={inputEl}
    type="file"
    {accept}
    {multiple}
    {disabled}
    class="sr-only"
    aria-label={label}
    tabindex="-1"
    onchange={onChange}
  />
  <svg class="file-upload__icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    {#if done}
      <path d="M5 13l4 4L19 7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none" />
    {:else}
      <path d="M12 15V3m0 0L8 7m4-4 4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none" />
      <path d="M3 15v4a2 2 0 002 2h14a2 2 0 002-2v-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" fill="none" />
    {/if}
  </svg>
  <div>
    <span class="file-upload__label">{done ?? label}</span>
    {#if !done && hint}
      <p class="file-upload__hint">{hint}</p>
    {/if}
  </div>
</div>
