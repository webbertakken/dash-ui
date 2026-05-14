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
  let inputEl = $state<HTMLInputElement | undefined>(undefined);

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
    if (!disabled) inputEl?.click();
  }

  function onKeyDown(e: KeyboardEvent) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (!disabled) inputEl?.click();
    }
  }
</script>

<div
  role="button"
  data-drag={drag ? 'true' : undefined}
  data-done={done ? 'true' : undefined}
  data-disabled={disabled ? 'true' : undefined}
  ondragover={onDragOver}
  ondragleave={onDragLeave}
  ondrop={onDrop}
  onclick={onClick}
  onkeydown={onKeyDown}
  tabindex={disabled ? -1 : 0}
  aria-label={done ?? label}
  class="flex cursor-pointer select-none flex-col items-center justify-center gap-2.5 rounded-[10px] border-[1.5px] border-dashed border-white/[0.14] bg-white/[0.02] p-6 text-center transition-[border-color,background-color] duration-100 hover:border-white/30 data-[drag=true]:border-brand-05 data-[drag=true]:bg-brand-05/[0.08] data-[done=true]:border-status-success data-[done=true]:bg-status-success/[0.08] data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-05"
>
  <input
    bind:this={inputEl}
    type="file"
    {accept}
    {multiple}
    {disabled}
    class="sr-only"
    aria-label={label}
    tabindex={-1}
    onchange={onChange}
  />
  <svg class="h-7 w-7 shrink-0 text-[#6e7079]" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    {#if done}
      <path d="M5 13l4 4L19 7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none" />
    {:else}
      <path d="M12 15V3m0 0L8 7m4-4 4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none" />
      <path d="M3 15v4a2 2 0 002 2h14a2 2 0 002-2v-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" fill="none" />
    {/if}
  </svg>
  <div>
    <span class="block text-13 text-[#c8c9d0]">{done ?? label}</span>
    {#if !done && hint}
      <p class="m-0 mt-1 text-11 text-[#6e7079]">{hint}</p>
    {/if}
  </div>
</div>
